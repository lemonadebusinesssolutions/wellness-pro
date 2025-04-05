//start of code
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import { Result, Recommendation } from "@shared/schema";

export default function Results() {
  const { type, resultId } = useParams();

  const {
    data: result,
    isLoading,
    error,
  } = useQuery<Result>({
    queryKey: [`/api/results/${resultId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!resultId,
  });

  const {
    data: recommendations,
    isLoading: recLoading,
  } = useQuery<Recommendation[]>({
    queryKey: [`/api/top-recommendations/${resultId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!resultId,
  });

  if (isLoading || recLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error || !result) {
    return <div className="p-6 text-red-600">Error loading result.</div>;
  }

  const formattedDate = new Date(result.completedAt).toLocaleDateString();

  // Safely cast categories
  const categories = Array.isArray(result.categories)
    ? (result.categories as { category: string; score: number }[])
    : [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your {type} Results</h1>
      <p className="text-gray-600 mb-2">Result ID: {resultId}</p>
      <p className="text-gray-600 mb-2">Taken on: {formattedDate}</p>
      <p className="text-lg font-medium mt-4">Score: {result.score}</p>

      {categories.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <ul className="list-disc list-inside space-y-1">
            {categories.map((cat, index) => (
              <li key={index}>
                <span className="font-medium">{cat.category}</span>: {cat.score}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white dark:bg-slate-800 p-4 rounded shadow">
                <h3 className="text-xl font-bold">{rec.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{rec.description}</p>
                {Array.isArray(rec.tips) && (
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {rec.tips.map((tip, i) => (
                      <li key={i}>{String(tip)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
//end of code
