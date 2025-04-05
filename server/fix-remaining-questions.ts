import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

interface QuestionUpdate {
  assessmentType: string;
  existingText: string;
  newText: string;
  category?: string;
}

async function fixRemainingQuestions() {
  try {
    console.log('Starting to fix remaining placeholder questions...');
    
    // Define improved questions for self_compassion assessment
    const selfCompassionQuestions: QuestionUpdate[] = [
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 6 for the self compassion assessment.',
        newText: 'I acknowledge my own flaws and limitations without harsh self-judgment.'
      },
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 7 for the self compassion assessment.',
        newText: 'When I fail at something important, I try to keep a balanced perspective rather than obsessing over it.'
      },
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 8 for the self compassion assessment.',
        newText: 'I give myself the care and tenderness I need during difficult times.'
      },
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 9 for the self compassion assessment.',
        newText: 'I try to see my failures as part of the common human experience rather than as something isolating.'
      },
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 10 for the self compassion assessment.',
        newText: 'I am patient and understanding with aspects of my personality I don\'t like.'
      }
    ];

    // Update each question in the database
    for (const update of selfCompassionQuestions) {
      const { assessmentType, existingText, newText, category } = update;
      
      // Get the category from the existing question if not provided
      if (!category) {
        const categoryResult = await pool.query(`
          SELECT category FROM questions 
          WHERE assessment_type = $1 AND text = $2
        `, [assessmentType, existingText]);
        
        if (categoryResult.rows.length > 0) {
          // Update the question text
          await pool.query(`
            UPDATE questions 
            SET text = $1 
            WHERE assessment_type = $2 AND text = $3
          `, [newText, assessmentType, existingText]);
          
          console.log(`Updated question in ${assessmentType} assessment: ${existingText.substring(0, 20)}... -> ${newText.substring(0, 20)}...`);
        } else {
          console.log(`Question not found: ${existingText.substring(0, 30)}...`);
        }
      } else {
        // Update the question text and category
        await pool.query(`
          UPDATE questions 
          SET text = $1, category = $2
          WHERE assessment_type = $3 AND text = $4
        `, [newText, category, assessmentType, existingText]);
        
        console.log(`Updated question in ${assessmentType} assessment: ${existingText.substring(0, 20)}... -> ${newText.substring(0, 20)}...`);
      }
    }

    // Check if there are any questions that still have placeholder text
    const remainingPlaceholdersResult = await pool.query(`
      SELECT assessment_type, COUNT(*) as count 
      FROM questions 
      WHERE text LIKE '%Question%for the%assessment%' 
      GROUP BY assessment_type
    `);

    if (remainingPlaceholdersResult.rows.length > 0) {
      console.log('Remaining placeholder questions:');
      console.table(remainingPlaceholdersResult.rows);
    } else {
      console.log('All placeholder questions have been updated successfully!');
    }

    console.log('Question content update completed!');
  } catch (error) {
    console.error('Error updating question content:', error);
  } finally {
    pool.end();
  }
}

fixRemainingQuestions();