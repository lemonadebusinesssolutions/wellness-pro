import pg from 'pg';
// Using environment variables directly

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function standardizeQuestions() {
  try {
    console.log('Standardizing questions to 15 per assessment type...');
    
    // Get current question counts
    const countResult = await pool.query(`
      SELECT assessment_type, COUNT(*) as question_count
      FROM questions
      GROUP BY assessment_type
      ORDER BY assessment_type
    `);
    
    const assessmentCounts = countResult.rows;
    console.log('Current question counts:', assessmentCounts);
    
    // For each assessment type, adjust to 15 questions
    for (const assessment of assessmentCounts) {
      const { assessment_type, question_count } = assessment;
      
      if (parseInt(question_count) > 15) {
        // Need to keep only the first 15 questions
        console.log(`Reducing ${assessment_type} questions from ${question_count} to 15...`);
        
        // Get all question IDs for this assessment, ordered by the "order" field
        const questionsResult = await pool.query(`
          SELECT id FROM questions 
          WHERE assessment_type = $1
          ORDER BY "order" ASC
        `, [assessment_type]);
        
        const questionIds = questionsResult.rows.map(row => row.id);
        const idsToDelete = questionIds.slice(15); // Get IDs after the first 15
        
        if (idsToDelete.length > 0) {
          // Delete questions beyond the first 15
          await pool.query(`
            DELETE FROM questions
            WHERE id IN (${idsToDelete.join(',')})
          `);
          console.log(`Deleted ${idsToDelete.length} excess questions from ${assessment_type}`);
        }
      } 
      else if (parseInt(question_count) < 15) {
        // Need to add more questions to reach 15
        const additionalCount = 15 - parseInt(question_count);
        console.log(`Adding ${additionalCount} questions to ${assessment_type} to reach 15...`);
        
        // Get the highest order number currently in use
        const orderResult = await pool.query(`
          SELECT MAX("order") as max_order
          FROM questions
          WHERE assessment_type = $1
        `, [assessment_type]);
        
        let nextOrder = parseInt(orderResult.rows[0].max_order || '0') + 1;
        
        // Get a sample of categories used in this assessment
        const categoryResult = await pool.query(`
          SELECT DISTINCT category
          FROM questions
          WHERE assessment_type = $1
        `, [assessment_type]);
        
        const categories = categoryResult.rows.map(row => row.category);
        const defaultCategory = categories[0] || 'general';
        
        // Define standard options for 5-point Likert scale
        const standardOptions = JSON.stringify([
          "Strongly Disagree", 
          "Disagree", 
          "Neither Agree nor Disagree", 
          "Agree", 
          "Strongly Agree"
        ]);
        
        // Add additional questions
        for (let i = 0; i < additionalCount; i++) {
          const category = categories[i % categories.length] || defaultCategory;
          const questionNumber = nextOrder;
          
          await pool.query(`
            INSERT INTO questions (assessment_type, text, options, "order", category)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            assessment_type,
            `Question ${questionNumber} for the ${assessment_type.replace('_', ' ')} assessment.`,
            standardOptions,
            nextOrder,
            category
          ]);
          
          nextOrder++;
        }
        
        console.log(`Added ${additionalCount} questions to ${assessment_type}`);
      }
      else {
        console.log(`${assessment_type} already has exactly 15 questions. No changes needed.`);
      }
    }
    
    console.log('All assessments now have exactly 15 questions!');
  } catch (error) {
    console.error('Error standardizing questions:', error);
  } finally {
    pool.end();
  }
}

standardizeQuestions();