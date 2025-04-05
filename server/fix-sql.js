import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the SQL file
const sqlFilePath = path.join(__dirname, 'seeds', 'additional-assessments.sql');

// Read the SQL file
let sql = fs.readFileSync(sqlFilePath, 'utf8');

// Reset the file to its original content
fs.writeFileSync(sqlFilePath + '.bak', sql);

// Update the recommendation inserts to include the tips column
sql = sql.replace(/INSERT INTO recommendations \(assessment_type, category, min_score, max_score, title, description, priority\) VALUES/g, 
  'INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority, tips) VALUES');

// Find all recommendation insert statements and add tips to them
const recommendationRegex = /\('(\w+)', '(\w+)', (\d+), (\d+), '([^']+)', '([^']+)', '(\w+)'\)/g;
sql = sql.replace(recommendationRegex, "('$1', '$2', $3, $4, '$5', '$6', '$7', '[]')"); 

// Find the last recommendations in each block
sql = sql.replace(/\('(\w+)', '(\w+)', (\d+), (\d+), '([^']+)', '([^']+)', '(\w+)'\);/g, 
                 "('$1', '$2', $3, $4, '$5', '$6', '$7', '[]');");

// Fix assessment entries with extra array values
const assessmentRegex = /\('(\w+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)', '\[\]'\)/g;
sql = sql.replace(assessmentRegex, "('$1', '$2', '$3', '$4', '$5')");

// Fix the question insert statements with extra array values
const questionRegex = /\('(\w+)', '([^']+)', '(\[[^\]]+\])', (\d+), '(\w+)', '\[\]'\)/g;
sql = sql.replace(questionRegex, "('$1', '$2', '$3', $4, '$5')");

const lastQuestionRegex = /\('(\w+)', '([^']+)', '(\[[^\]]+\])', (\d+), '(\w+)', '\[\]'\);/g;
sql = sql.replace(lastQuestionRegex, "('$1', '$2', '$3', $4, '$5');");

// Write the updated SQL back to file
fs.writeFileSync(sqlFilePath, sql);

console.log('SQL file has been fixed to include tips column with default values');