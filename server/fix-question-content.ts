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

async function fixQuestionContent() {
  try {
    console.log('Starting to fix placeholder questions...');
    
    // Define improved questions for each assessment type
    const digitalQuestions: QuestionUpdate[] = [
      {
        assessmentType: 'digital',
        existingText: 'Question 4 for the digital assessment.',
        newText: 'I find it difficult to focus on tasks due to digital distractions like notifications.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 5 for the digital assessment.',
        newText: 'I feel anxious when I cannot check my phone or access the internet.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 6 for the digital assessment.',
        newText: 'I regularly take breaks from screen time to protect my mental wellbeing.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 7 for the digital assessment.',
        newText: 'I have clear boundaries around my use of digital devices during social interactions.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 8 for the digital assessment.',
        newText: 'I frequently lose track of time when using digital devices or social media.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 9 for the digital assessment.',
        newText: 'I feel that my digital habits negatively affect my sleep quality.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 10 for the digital assessment.',
        newText: 'I have systems in place to manage information overload from digital sources.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 11 for the digital assessment.',
        newText: 'I regularly engage with digital content that contributes positively to my wellbeing.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 12 for the digital assessment.',
        newText: 'I find myself comparing my life to others based on what I see on social media.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 13 for the digital assessment.',
        newText: 'I have strategies to protect my privacy and security in digital environments.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 14 for the digital assessment.',
        newText: 'I am mindful about the digital content I consume and how it affects my mood.'
      },
      {
        assessmentType: 'digital',
        existingText: 'Question 15 for the digital assessment.',
        newText: 'I actively seek digital-free activities to balance my lifestyle.'
      }
    ];

    const stressQuestions: QuestionUpdate[] = [
      {
        assessmentType: 'stress',
        existingText: 'Question 6 for the stress assessment.',
        newText: 'I find it difficult to relax and unwind after a stressful day.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 7 for the stress assessment.',
        newText: 'I experience physical symptoms such as headaches or muscle tension when under stress.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 8 for the stress assessment.',
        newText: 'I have effective coping strategies to manage stress in healthy ways.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 9 for the stress assessment.',
        newText: 'I find myself becoming irritable or short-tempered due to stress.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 10 for the stress assessment.',
        newText: 'I feel overwhelmed by the demands and responsibilities in my life.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 11 for the stress assessment.',
        newText: 'I practice mindfulness or other relaxation techniques to manage stress.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 12 for the stress assessment.',
        newText: 'I have difficulty concentrating or making decisions when under stress.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 13 for the stress assessment.',
        newText: 'I seek support from others when feeling stressed rather than isolating myself.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 14 for the stress assessment.',
        newText: 'I maintain healthy habits like regular exercise and good nutrition even during stressful periods.'
      },
      {
        assessmentType: 'stress',
        existingText: 'Question 15 for the stress assessment.',
        newText: 'I am able to identify my stress triggers and take proactive measures to address them.'
      }
    ];

    const workplaceQuestions: QuestionUpdate[] = [
      {
        assessmentType: 'workplace',
        existingText: 'Question 4 for the workplace assessment.',
        newText: 'I feel valued and appreciated for my contributions at work.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 5 for the workplace assessment.',
        newText: 'My workload is manageable and allows for a healthy work-life balance.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 6 for the workplace assessment.',
        newText: 'I have opportunities for growth and development in my workplace.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 7 for the workplace assessment.',
        newText: 'I feel comfortable expressing my ideas and opinions at work.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 8 for the workplace assessment.',
        newText: 'I have supportive relationships with my colleagues and supervisors.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 9 for the workplace assessment.',
        newText: 'My physical work environment is comfortable and conducive to productivity.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 10 for the workplace assessment.',
        newText: 'I feel aligned with my organization\'s values and mission.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 11 for the workplace assessment.',
        newText: 'I receive clear communication about expectations and feedback on my performance.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 12 for the workplace assessment.',
        newText: 'I have autonomy in how I complete my work responsibilities.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 13 for the workplace assessment.',
        newText: 'I feel that my work is meaningful and contributes to something important.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 14 for the workplace assessment.',
        newText: 'My workplace has policies and practices that support mental and physical wellbeing.'
      },
      {
        assessmentType: 'workplace',
        existingText: 'Question 15 for the workplace assessment.',
        newText: 'I am able to effectively manage work-related stress and prevent burnout.'
      }
    ];

    const selfCompassionQuestions: QuestionUpdate[] = [
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 11 for the self compassion assessment.',
        newText: 'I treat myself with kindness during difficult times rather than harsh self-criticism.'
      },
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 12 for the self compassion assessment.',
        newText: 'I recognize that struggling and making mistakes is part of being human.'
      },
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 13 for the self compassion assessment.',
        newText: 'I maintain a balanced perspective on negative emotions rather than getting caught up in them.'
      },
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 14 for the self compassion assessment.',
        newText: 'I speak to myself in a supportive way, as I would to a good friend.'
      },
      {
        assessmentType: 'self_compassion',
        existingText: 'Question 15 for the self compassion assessment.',
        newText: 'I practice self-care activities that nurture my physical and emotional wellbeing.'
      }
    ];

    // Combine all question updates
    const allUpdates = [
      ...digitalQuestions,
      ...stressQuestions,
      ...workplaceQuestions,
      ...selfCompassionQuestions
    ];

    // Update each question in the database
    for (const update of allUpdates) {
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

fixQuestionContent();