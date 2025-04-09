import { Question } from "@shared/schema";

export function calculateScoreAndCategories(questions: Question[], answers: number[]) {
  let total = 0;
  const categoryMap: Record<string, number[]> = {};

  questions.forEach((question, index) => {
    const answer = answers[index];
    total += answer;

    const cat = question.category;
    if (!categoryMap[cat]) {
      categoryMap[cat] = [];
    }
    categoryMap[cat].push(answer);
  });

  const categories: Record<string, number> = {};
  for (const [category, values] of Object.entries(categoryMap)) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    categories[category] = Math.round(avg);
  }

  return {
    score: Math.round(total / answers.length),
    categories,
  };
}
