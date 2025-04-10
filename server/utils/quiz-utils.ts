import { Question } from "@shared/schema";

export function calculateScoreAndCategories(questions: Question[], answers: number[]) {
  let rawTotal = 0;
  const categoryMap: Record<string, number[]> = {};

  questions.forEach((question, index) => {
    const answer = answers[index];

    // 🧠 Normalize category: lowercase, trim, strip trailing digits
    const cat = question.category.trim().toLowerCase().replace(/\d+$/, '');

    // 🟢 Scale answer to 0–100 range (for 5-point scale: 0=0, 1=25, ..., 4=100)
    const scaled = Math.round((answer / 4) * 100);
    rawTotal += scaled;

    if (!categoryMap[cat]) {
      categoryMap[cat] = [];
    }
    categoryMap[cat].push(scaled);
  });

  const categories: Record<string, number> = {};
  for (const [category, values] of Object.entries(categoryMap)) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    categories[category] = Math.round(avg);
  }

  const score = Math.round(rawTotal / answers.length);

  return {
    score,
    categories,
  };
}
