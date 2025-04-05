import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ResultsSummary from "@/components/results/ResultsSummary";
import RecommendationAccordion from "@/components/results/RecommendationAccordion";
import { useState } from "react";

interface Result {
  id: number;
  assessmentType: string;
  userId: number | null;
  score: number;
  answers: unknown;
  categories: unknown;
  completedAt: Date;
}

interface Recommendation {
  id: number;
  assessmentType: string;
  category: string;
  title: string;
  description: string;
  tips: string[]; // or `unknown` if it varies
  minScore: number;
  maxScore: number;
  priority: string;
}


interface ResultsResponse {
  result: Result;
  recommendations: Recommendation[];
}

export default function Results() {
  const { type, resultId } = useParams<{ type: string; resultId: string }>();
  const [, navigate] = useLocation();

  const { data, isLoading, error } = useQuery<ResultsResponse>({
    queryKey: [`/api/result/${resultId}`],
  });

  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  const toggleRecommendation = (id: string) => {
    setExpandedRecommendation((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-500">
            Failed to load results. Please try again later.
          </div>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </main>
    );
  }

  const { result, recommendations } = data;

  return (
    <main className="flex-grow">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Your {result.assessmentType.charAt(0).toUpperCase() + result.assessmentType.slice(1)} Assessment Results
          </h2>
          <p className="mt-2 text-gray-600">
            Completed on {new Date(result.completedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <ResultsSummary result={result} />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Personalized Recommendations</h3>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {recommendations.map((recommendation, index) => (
            <RecommendationAccordion
              key={index}
              id={`rec${index}`}
              recommendation={recommendation}
              isExpanded={expandedRecommendation === `rec${index}`}
              onToggle={() => toggleRecommendation(`rec${index}`)}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Assessments
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            View All Results
          </Button>
        </div>
      </div>
    </main>
  );
}