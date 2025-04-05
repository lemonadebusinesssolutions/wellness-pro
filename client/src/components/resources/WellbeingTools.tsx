import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BreathingExercise from "./BreathingExercise";
import GratitudeJournal from "./GratitudeJournal";
import MoodTracker from "./MoodTracker";
import { Loader2 } from "lucide-react";

type Tool = {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
};

export default function WellbeingTools() {
  const [loading, setLoading] = useState<string | null>(null);
  
  // Define available wellbeing tools
  const tools: Tool[] = [
    {
      id: "breathing",
      name: "Breathing Exercise",
      description: "Interactive exercises to help manage stress and anxiety",
      component: <BreathingExercise />
    },
    {
      id: "gratitude",
      name: "Gratitude Journal",
      description: "Record and reflect on things you're grateful for",
      component: <GratitudeJournal />
    },
    {
      id: "mood",
      name: "Mood Tracker",
      description: "Track your mood patterns over time",
      component: <MoodTracker />
    }
  ];
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    // Show loading state briefly
    setLoading(value);
    setTimeout(() => {
      setLoading(null);
    }, 300);
  };
  
  return (
    <Card className="w-full bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold dark:text-white">Wellbeing Tools</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Interactive tools to support your wellbeing journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breathing" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            {tools.map((tool) => (
              <TabsTrigger key={tool.id} value={tool.id} className="text-sm">
                {tool.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tools.map((tool) => (
            <TabsContent key={tool.id} value={tool.id} className="mt-0">
              {loading === tool.id ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                tool.component
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}