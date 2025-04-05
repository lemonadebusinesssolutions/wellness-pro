import { Recommendation } from "@shared/schema";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

type RecommendationAccordionProps = {
  id: string;
  recommendation: Recommendation;
  isExpanded: boolean;
  onToggle: () => void;
};

export default function RecommendationAccordion({ 
  id, 
  recommendation, 
  isExpanded, 
  onToggle 
}: RecommendationAccordionProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div 
        className="flex items-center p-4 cursor-pointer" 
        onClick={onToggle}
      >
        <Check className="h-5 w-5 text-primary-600 mr-3" />
        <h4 className="text-lg font-medium text-gray-900">{recommendation.title}</h4>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400 ml-auto" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 ml-auto" />
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-gray-700 mb-3">{recommendation.description}</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {(recommendation.tips as string[]).map((tip: string, index: number) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}