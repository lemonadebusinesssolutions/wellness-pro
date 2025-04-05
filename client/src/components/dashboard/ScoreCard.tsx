import { Result } from "@shared/schema";
import { Link } from "wouter";
import { getScoreLabel, formatDate } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

type ScoreCardProps = {
  result: Result;
};

export default function ScoreCard({ result }: ScoreCardProps) {
  const { assessmentType, score, completedAt } = result;
  const scoreInfo = getScoreLabel(score);
  
  // Define status badge styling based on score label
  const statusBadgeStyles: Record<string, string> = {
    "Excellent": "bg-green-100 text-green-800",
    "Good": "bg-green-100 text-green-800",
    "Moderate": "bg-amber-100 text-amber-800",
    "Needs Attention": "bg-red-100 text-red-800",
    "Critical": "bg-red-100 text-red-800"
  };
  
  // Generate a random trend percentage (between -15 and +15) for demo purposes
  // In a real application, this would be calculated based on historical data
  const trendPercentage = Math.floor(Math.random() * 31) - 15;
  const isTrendPositive = trendPercentage >= 0;
  
  // For demo purposes, let's apply a name transformation
  const typeTitle = assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1);
  const cardTitle = 
    assessmentType === 'stress' ? 'Stress Level' : 
    assessmentType === 'workplace' ? 'Workplace Wellbeing' : 
    assessmentType === 'digital' ? 'Digital Wellbeing' : typeTitle;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{cardTitle}</h3>
        <span className={`px-2 py-1 ${statusBadgeStyles[scoreInfo.label]} text-xs font-medium rounded-full`}>
          {scoreInfo.label}
        </span>
      </div>
      <div className="flex items-end mb-4">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-sm text-gray-500 ml-2">/ 100</span>
        <span className={`ml-auto flex items-center text-sm ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isTrendPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          {Math.abs(trendPercentage)}%
        </span>
      </div>
      <p className="text-sm text-gray-600">Last assessed on {formatDate(completedAt)}</p>
      <Link href={`/quiz/${assessmentType}`}>
        <button className="mt-4 text-primary-600 text-sm font-medium hover:text-primary-700">
          Retake Assessment →
        </button>
      </Link>
    </div>
  );
}
