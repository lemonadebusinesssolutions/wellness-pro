import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Activity, Brain, Heart, LineChart, ListChecks, Scale, Target } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Discover Your</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-cyan-400 dark:to-blue-400">
                Complete Wellbeing
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Evaluate multiple dimensions of your wellbeing and receive personalized recommendations to improve your overall quality of life..
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/assessments">
                <Button size="lg" className="rounded-full px-8">
                  Take an Assessment
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Comprehensive Wellbeing Evaluation</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform offers assessment tools across multiple domains of wellbeing to provide a holistic view of your health and wellness.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
                </div>
                <CardTitle className="dark:text-white">Emotional Wellbeing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">Assess your emotional health, stress levels, and resilience to life's challenges.</CardDescription>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
                </div>
                <CardTitle className="dark:text-white">Physical Health</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">Evaluate your physical activity habits, nutrition, and overall energy levels.</CardDescription>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
                </div>
                <CardTitle className="dark:text-white">Mental Wellbeing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">Gauge your mindfulness practices, cognitive health, and mental clarity.</CardDescription>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center">
                  <Scale className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
                </div>
                <CardTitle className="dark:text-white">Work-Life Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">Analyze your workplace wellbeing and ability to balance professional and personal life.</CardDescription>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
                </div>
                <CardTitle className="dark:text-white">Life Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">Explore your sense of meaning, purpose, and fulfillment in life.</CardDescription>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-700 dark:border-slate-600">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
                </div>
                <CardTitle className="dark:text-white">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">Monitor your wellbeing journey with personalized dashboards and insights.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50 dark:bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto">
              Our platform makes it easy to assess, track, and improve your wellbeing in just a few simple steps.
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mx-auto mb-4">
                <ListChecks className="h-8 w-8 text-primary-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Take Assessments</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete short assessments across different wellbeing domains to establish your baseline.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Get Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">Receive personalized recommendations based on your assessment results.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mx-auto mb-4">
                <LineChart className="h-8 w-8 text-primary-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">Retake assessments periodically to monitor improvements and refine your wellbeing journey.</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/assessments">
              <Button size="lg" className="rounded-full px-8">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
