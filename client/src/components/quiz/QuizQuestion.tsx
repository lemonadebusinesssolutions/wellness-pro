import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type QuizQuestionProps = {
  question: string;
  options: string[];
  selectedValue?: number;
  onSelect: (value: number) => void;
};

export default function QuizQuestion({ question, options, selectedValue, onSelect }: QuizQuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{question}</h3>
      
      <div className="space-y-3">
        {options.map((option, index) => {
          const value = index + 1; // 1-based indexing for values
          const isSelected = selectedValue === value;
          
          return (
            <div 
              key={index}
              className={cn(
                "quiz-option flex items-center p-3 border-2 rounded-md cursor-pointer transition-all duration-200",
                isSelected 
                  ? "border-primary-600 bg-primary-50 selected" 
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
              onClick={() => onSelect(value)}
            >
              <div 
                className={cn(
                  "quiz-checkbox w-6 h-6 flex items-center justify-center mr-3 rounded-md transition-all duration-200",
                  isSelected 
                    ? "bg-primary-600 border-primary-600 ring-2 ring-primary-200" 
                    : "border-2 border-gray-300 bg-white"
                )}
              >
                {isSelected && (
                  <CheckIcon className="w-4 h-4 text-white" />
                )}
              </div>
              <span className={cn(
                "text-gray-800 font-medium",
                isSelected && "text-primary-900"
              )}>
                {option}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
