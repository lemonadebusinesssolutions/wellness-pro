import { Result } from "@shared/schema";
import { getScoreLabel, getCategoryScoreLabel } from "@/lib/utils";

type ResultsSummaryProps = {
  result: Result;
};

export default function ResultsSummary({ result }: ResultsSummaryProps) {
  const { score, categories } = result;
  const scoreInfo = getScoreLabel(score);
  
  // Define color based on score
  const scoreColorMap: Record<string, string> = {
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600"
  };
  
  // Define progress bar color based on category score
  const progressBarColorMap: Record<string, string> = {
    green: "bg-green-500",
    amber: "bg-amber-500",
    red: "bg-red-500"
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Score</h3>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary-100 mb-4">
              <span className="text-4xl font-bold text-primary-600">{score}</span>
            </div>
            <p className="text-gray-700 font-medium">{scoreInfo.label}</p>
            <p className="text-sm text-gray-600 mt-2">
              {score >= 80 ? (
                "Your score indicates excellent wellbeing in this area. Keep up the good work!"
              ) : score >= 70 ? (
                "Your score indicates good wellbeing in this area with some opportunities for improvement."
              ) : score >= 50 ? (
                "Your score indicates moderate challenges that may be affecting your wellbeing."
              ) : (
                "Your score indicates significant challenges in this area that need attention."
              )}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Areas</h3>
          <div className="space-y-4">
            {Object.entries(categories as Record<string, number>).map(([category, categoryScore]) => {
              const label = getCategoryScoreLabel(categoryScore);
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-600">{label.label}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 ${progressBarColorMap[label.color]} rounded-full`} 
                      style={{ width: `${categoryScore}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
