type ProgressBarProps = {
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
};

export default function ProgressBar({ 
  currentQuestion, 
  totalQuestions, 
  progress 
}: ProgressBarProps) {
  return (
    <div className="mt-6">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Question {currentQuestion} of {totalQuestions}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-2 bg-primary-600 rounded-full progress-bar" 
          style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
        ></div>
      </div>
    </div>
  );
}
