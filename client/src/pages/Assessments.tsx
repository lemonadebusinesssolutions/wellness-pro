import { useQuery } from "@tanstack/react-query";
import { Assessment } from "@shared/schema";
import AssessmentCard from "@/components/assessment/AssessmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Assessments() {
  const {
    data: assessments,
    isLoading,
    error,
  } = useQuery<Assessment[], Error>({
    queryKey: ["/api/assessments"],
  });

  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !assessments) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-500">
            Failed to load assessments. {(error as Error)?.message || "Please try again later."}
          </div>
        </div>
      </main>
    );
  }

  const wellbeingAssessments = assessments.filter((a) =>
    ["happiness", "physical_wellbeing", "emotional_wellbeing", "social_connection", "sleep_quality"].includes(a.type)
  );

  const mentalAssessments = assessments.filter((a) =>
    ["stress", "mindfulness", "self_compassion", "resilience", "life_purpose"].includes(a.type)
  );

  const lifestyleAssessments = assessments.filter((a) =>
    ["workplace", "digital", "financial_wellbeing", "nutrition", "physical_activity"].includes(a.type)
  );

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Wellbeing Assessments</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from a variety of assessments to gain insights into different aspects of your wellbeing and receive
            personalized recommendations.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto mb-8">
            <TabsTrigger value="all">All Assessments</TabsTrigger>
            <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
            <TabsTrigger value="mental">Mental Health</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {assessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wellbeing">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {wellbeingAssessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mental">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {mentalAssessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lifestyle">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {lifestyleAssessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
