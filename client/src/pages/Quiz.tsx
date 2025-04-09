import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Question, SubmitQuizPayload } from "@shared/schema";
import { useState } from "react";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import ProgressBar from "@/components/quiz/ProgressBar";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAnonymousUserId } from "@/lib/utils";

interface Assessment {
  title: string;
  description: string;
}

export default function Quiz() {
  const { type } = useParams<{ type?: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const {
    data: questions,
    isLoading: questionsLoading,
    error: questionsError,
  } = useQuery<Question[]>({
    queryKey: [`questions/${type}`],
  });

  const {
    data: assessment,
    isLoading: assessmentLoading,
  } = useQuery<Assessment>({
    queryKey: [`assessments/${type}`],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitQuizPayload) => {
      return await apiRequest<{ result: { id: number } }>("submit-quiz", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (data) => {
      navigate(`/results/${type}/${data.result.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting quiz",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  if (questionsLoading || assessmentLoading) {
    return (
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          Loading quiz…
        </div>
      </main>
    );
  }

  if (questionsError || !questions || !assessment || !type) {
    return (
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center text-red-500">
          Failed to load quiz. Please try again later.
        </div>
        <div className="text-center">
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </main>
    );
  }

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (answers[currentQuestionIndex] === undefined) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitMutation.mutate({
        assessmentType: type as SubmitQuizPayload["assessmentType"],
        answers,
        userId: getAnonymousUserId(),
      });
    }
  };

  return (
    <main className="flex-grow">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
          <p className="text-gray-600">{assessment.description}</p>
        </div>

        <ProgressBar
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          progress={progress}
        />

        <QuizQuestion
          question={currentQuestion.text}
          options={currentQuestion.options as string[]}
          selectedValue={answers[currentQuestionIndex]}
          onSelect={handleAnswer}
        />

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={submitMutation.isPending}>
            {currentQuestionIndex === totalQuestions - 1
              ? submitMutation.isPending
                ? "Submitting..."
                : "Finish"
              : "Next"}
          </Button>
        </div>
      </div>
    </main>
  );
}
