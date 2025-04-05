import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Assessment } from "@shared/schema";
import { Link } from "wouter";
import { getAssessmentColor } from "@/lib/utils";
import { Activity, Brain, Heart, Leaf, Moon, Smile, Users, Dumbbell, BookOpen, Zap, Coins, Target } from "lucide-react";

type AssessmentCardProps = {
  assessment: Assessment;
};

// Map of assessment types to icons
const assessmentIcons: Record<string, React.ReactNode> = {
  stress: <Brain className="h-6 w-6" />,
  workplace: <Activity className="h-6 w-6" />,
  digital: <Zap className="h-6 w-6" />,
  happiness: <Smile className="h-6 w-6" />,
  physical_wellbeing: <Dumbbell className="h-6 w-6" />,
  emotional_wellbeing: <Heart className="h-6 w-6" />,
  social_connection: <Users className="h-6 w-6" />,
  sleep_quality: <Moon className="h-6 w-6" />,
  mindfulness: <Leaf className="h-6 w-6" />,
  self_compassion: <Heart className="h-6 w-6" />,
  financial_wellbeing: <Coins className="h-6 w-6" />,
  life_purpose: <Target className="h-6 w-6" />,
  resilience: <Zap className="h-6 w-6" />,
  nutrition: <Leaf className="h-6 w-6" />,
  physical_activity: <Dumbbell className="h-6 w-6" />,
};

// Format assessment type for display
function formatAssessmentType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function AssessmentCard({ assessment }: AssessmentCardProps) {
  const { type, description } = assessment;
  const { bgColor, textColor } = getAssessmentColor(type);
  const formattedType = formatAssessmentType(type);
  const IconComponent = assessmentIcons[type] || <BookOpen className="h-6 w-6" />;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className={`${bgColor} flex flex-row items-center gap-4`}>
        <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <div className="text-white">{IconComponent}</div>
        </div>
        <CardTitle className="text-white">{formattedType}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <CardDescription className="text-base mb-4">{description}</CardDescription>
        <div className="flex items-center text-sm">
          <span className="flex items-center text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            10-15 min
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-gray-500">15 questions</span>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 p-4">
        <Link href={`/quiz/${type}`}>
          <Button className="w-full">Start Assessment</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}