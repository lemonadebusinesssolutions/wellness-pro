import { Recommendation } from "@shared/schema";
import { getAssessmentColor, getRecommendationPriorityLabel } from "@/lib/utils";
import { AlertTriangle, Zap, CheckCircle } from "lucide-react";

type RecommendationCardProps = {
  recommendation: Recommendation & { 
    assessmentType: string;
    score?: number;
  };
};

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { title, description, priority, category, assessmentType } = recommendation;
  const priorityInfo = getRecommendationPriorityLabel(priority);
  
  // Get the right icon based on priority
  const PriorityIcon = 
    priority === 'High' ? AlertTriangle : 
    priority === 'Medium' ? Zap : 
    CheckCircle;
  
  // Get colors based on assessment type
  const { textColor, iconBgColor } = getAssessmentColor(assessmentType);
  
  // Define background color for the icon
  const iconBgColorMap: Record<string, string> = {
    'High': 'bg-red-100',
    'Medium': 'bg-amber-100',
    'Low': 'bg-green-100'
  };
  
  // Define text color for the icon
  const iconTextColorMap: Record<string, string> = {
    'High': 'text-red-600',
    'Medium': 'text-amber-600',
    'Low': 'text-green-600'
  };
  
  // Convert assessment type to title case
  const assessmentTypeTitle = assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1);
  
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColorMap[priority]} flex items-center justify-center mr-4`}>
          <PriorityIcon className={`h-5 w-5 ${iconTextColorMap[priority]}`} />
        </div>
        <div>
          <h4 className="text-md font-medium text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
          <div className="mt-3">
            <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {assessmentTypeTitle} • {category}
            </span>
            <span className={`inline-flex items-center text-xs font-medium ${iconTextColorMap[priority]} ${iconBgColorMap[priority]} ml-2 px-2 py-1 rounded-full`}>
              {priorityInfo.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
