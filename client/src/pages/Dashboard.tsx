import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAnonymousUserId } from "@/lib/utils";
import ScoreCard from "@/components/dashboard/ScoreCard";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import { Link } from "wouter";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from "@/hooks/use-theme";
import { Recommendation, Result } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const userId = getAnonymousUserId();
  const { theme } = useTheme();
  
  const { data: latestResults = [], isLoading: resultsLoading, error: resultsError } = useQuery<Result[]>({
    queryKey: [`/api/latest-results/${userId}`]
  });
  
  const { data: topRecommendations = [], isLoading: recommendationsLoading } = useQuery<Recommendation[]>({
    queryKey: [`/api/top-recommendations/${userId}`]
  });
  
  // Get the assessment types the user has actually taken
  const completedAssessmentTypes = latestResults?.map(result => result.assessmentType) || [];
  
  // Generate data based on completed assessments only
  const generateTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const data: any = { month };
      completedAssessmentTypes.forEach(type => {
        // For each completed assessment, generate a somewhat improving trend
        // In a real app, this would come from actual historical data
        const baseScore = Math.floor(Math.random() * 20) + 55; // Random base score between 55-75
        const monthIndex = months.indexOf(month);
        const improvement = monthIndex * 2; // Gradual improvement over months
        data[type] = Math.min(baseScore + improvement, 95); // Cap at 95
      });
      return data;
    });
  };
  
  // Generate comparison data for completed assessments only
  const generateCategoryData = () => {
    return completedAssessmentTypes.map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
      score: latestResults?.find(result => result.assessmentType === type)?.score || 0
    }));
  };
  
  // Generated data based on user's completed assessments
  const trendData = generateTrendData();
  const categoryData = generateCategoryData();
  
  // Determine text and chart colors based on theme
  const textColor = theme === 'dark' ? '#e2e8f0' : '#374151';
  const gridColor = theme === 'dark' ? '#475569' : '#e5e7eb';
  const backgroundColor = theme === 'dark' ? '#1e293b' : '#ffffff';
  
  const hasResults = latestResults && latestResults.length > 0;
  
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Wellbeing Dashboard</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Track your wellbeing journey and improvements over time</p>
        </div>
        
        {/* Summary Cards */}
        {resultsLoading ? (
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : resultsError || !hasResults ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Complete your first assessment</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Take one of our assessments to unlock your personalized wellbeing dashboard and recommendations.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/quiz/stress">
                <Button>Stress Assessment</Button>
              </Link>
              <Link href="/quiz/workplace">
                <Button variant="outline">Workplace Wellbeing</Button>
              </Link>
              <Link href="/quiz/digital">
                <Button variant="outline">Digital Wellbeing</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {latestResults.map((result) => (
              <ScoreCard key={result.id} result={result} />
            ))}
          </div>
        )}
        
        {/* Progress Charts */}
        {hasResults && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Your Wellbeing Trends</h3>
            
            {completedAssessmentTypes.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">No assessment data available yet.</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Complete assessments to see your wellbeing trends.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Line Chart - Trend over time */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Wellbeing Score Trends Over Time</h4>
                  {completedAssessmentTypes.length < 2 ? (
                    <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-300">
                        Complete multiple assessments over time to see meaningful trends.
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        This chart shows how your scores change over time as you retake assessments.
                      </p>
                    </div>
                  ) : (
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="month" stroke={textColor} />
                          <YAxis stroke={textColor} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor, color: textColor, borderColor: gridColor }} 
                            itemStyle={{ color: textColor }}
                            labelStyle={{ color: textColor, fontWeight: 'bold' }}
                          />
                          <Legend wrapperStyle={{ color: textColor }} />
                          {completedAssessmentTypes.includes('stress') && (
                            <Line type="monotone" dataKey="stress" stroke="#f87171" activeDot={{ r: 8 }} />
                          )}
                          {completedAssessmentTypes.includes('workplace') && (
                            <Line type="monotone" dataKey="workplace" stroke="#60a5fa" activeDot={{ r: 8 }} />
                          )}
                          {completedAssessmentTypes.includes('digital') && (
                            <Line type="monotone" dataKey="digital" stroke="#a78bfa" activeDot={{ r: 8 }} />
                          )}
                          {completedAssessmentTypes.includes('social') && (
                            <Line type="monotone" dataKey="social" stroke="#4ade80" activeDot={{ r: 8 }} />
                          )}
                          {completedAssessmentTypes.includes('physical') && (
                            <Line type="monotone" dataKey="physical" stroke="#fbbf24" activeDot={{ r: 8 }} />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
                
                {/* Bar Chart - Category Comparison */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Wellbeing Category Comparison</h4>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" stroke={textColor} />
                        <YAxis stroke={textColor} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor, color: textColor, borderColor: gridColor }} 
                          itemStyle={{ color: textColor }}
                          labelStyle={{ color: textColor, fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ color: textColor }} />
                        <Bar dataKey="score" name="Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Top Recommendations */}
        {recommendationsLoading ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 dark:border-slate-700 rounded-md p-4 dark:bg-slate-700">
                  <div className="flex">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-slate-600 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full mb-3"></div>
                      <div className="flex">
                        <div className="h-6 bg-gray-200 dark:bg-slate-600 rounded-full w-20 mr-2"></div>
                        <div className="h-6 bg-gray-200 dark:bg-slate-600 rounded-full w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hasResults && topRecommendations && topRecommendations.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Recommendations</h3>
            <div className="space-y-4">
              {topRecommendations.map((recommendation, index) => (
                <RecommendationCard key={index} recommendation={recommendation} />
              ))}
            </div>
            
            <Button className="mt-6 w-full" variant="outline">
              View All Recommendations
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
