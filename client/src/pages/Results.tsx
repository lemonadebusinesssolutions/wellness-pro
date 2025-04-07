import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

type Result = {
  id: number;
  userId: number;
  assessmentType: string;
  score: number;
  answers: number[];
  categories: string[];
  completedAt: string;
};

type Recommendation = {
  id: number;
  assessmentType: string;
  category: string;
  title: string;
  description: string;
  tips: string[];
  minScore: number;
  maxScore: number;
  priority: string;
};

export default function Results() {
  const { type, resultId } = useParams();
  const { user } = useAuth();

  const {
    data: resultData,
    isLoading,
    error,
  } = useQuery<{ result: Result; recommendations: Recommendation[] }>({
    queryKey: [`/result/${resultId}`],
    queryFn: getQueryFn(`/result/${resultId}`),

  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error || !resultData?.result) return <div className="p-6">Error loading result.</div>;

  const result = resultData.result;
  const recommendations = resultData.recommendations;
  const date = result.completedAt ? new Date(result.completedAt) : null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your {type} Results</h1>
      <p className="text-sm text-muted-foreground">Result ID: {resultId}</p>

      <div className="mt-4 bg-slate-100 dark:bg-slate-800 p-4 rounded shadow">
        <p className="text-lg font-semibold">
          Taken on: {date ? date.toLocaleString() : "N/A"}
        </p>
        <p className="text-lg">Score: {result.score}</p>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          {Array.isArray(result.categories) && result.categories.length > 0 ? (
            <ul className="list-disc list-inside">
              {result.categories.map((cat, index) => (
                <li key={index}>{cat}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No categories listed.</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Top Recommendations</h2>
        {Array.isArray(recommendations) && recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 border rounded shadow-md bg-white dark:bg-slate-700"
              >
                <h3 className="text-lg font-bold">{rec.title}</h3>
                <p className="text-sm italic text-slate-600 dark:text-slate-300">
                  Category: {rec.category} (Score range: {rec.minScore}–{rec.maxScore})
                </p>
                <p className="mt-2">{rec.description}</p>
                {Array.isArray(rec.tips) && rec.tips.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside text-sm text-slate-700 dark:text-slate-200">
                    {rec.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No tips available.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recommendations found.</p>
        )}
      </div>
    </div>
  );
}
