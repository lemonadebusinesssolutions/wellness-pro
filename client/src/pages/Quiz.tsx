import { useParams, useLocation } from "wouter"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Question, SubmitQuizPayload } from "@shared/schema"
import { useState } from "react"
import QuizQuestion from "@/components/quiz/QuizQuestion"
import ProgressBar from "@/components/quiz/ProgressBar"
import { apiRequest } from "@/lib/queryClient"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getAnonymousUserId } from "@/lib/utils"

interface Assessment {
  title: string
  description: string
}

export default function Quiz() {
  const { type } = useParams<{ type?: string }>()
  const [, navigate] = useLocation()
  const { toast } = useToast()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const {
    data: questions,
    isLoading: questionsLoading,
    error: questionsError,
  } = useQuery<Question[]>({
    queryKey: [`questions/${type}`],
    queryFn: () => apiRequest<Question[]>(`questions/${type}`),
  })

  const {
    data: assessment,
    isLoading: assessmentLoading,
  } = useQuery<Assessment>({
    queryKey: [`assessments/${type}`],
    queryFn: () => apiRequest<Assessment>(`assessments/${type}`),
  })

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitQuizPayload) => {
      return await apiRequest<{ result: { id: number } }>("submit-quiz", {
        method: "POST",
        body: data,
      })
    },
    onSuccess: (data) => {
      navigate(`/results/${type}/${data.result.id}`)
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting quiz",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    },
  })

  if (questionsLoading || assessmentLoading) {
    return (
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mx-auto mb-6"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-full mb-8"></div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (questionsError || !questions || !assessment || !type) {
    return (
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-500">
            Failed to load quiz. Please try again later.
          </div>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </main>
    )
  }

  const totalQuestions = questions.length
  const currentQuestion = questions[currentQuestionIndex]
  const progress = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = value
    setAnswers(newAnswers)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (answers[currentQuestionIndex] === undefined) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before continuing.",
        variant: "destructive",
      })
      return
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      submitMutation.mutate({
        assessmentType: type as SubmitQuizPayload["assessmentType"],
        answers: answers,
        userId: getAnonymousUserId(),
      })
    }
  }

  return (
    <main className="flex-grow">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h2>
          <p className="text-gray-600">{assessment.description}</p>

          <ProgressBar
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            progress={progress}
          />
        </div>

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
          <Button
            onClick={handleNext}
            disabled={submitMutation.isPending}
          >
            {currentQuestionIndex === totalQuestions - 1
              ? submitMutation.isPending
                ? "Submitting..."
                : "Finish"
              : "Next"}
          </Button>
        </div>
      </div>
    </main>
  )
}
