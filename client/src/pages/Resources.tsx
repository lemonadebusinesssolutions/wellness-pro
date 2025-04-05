import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { articles } from "@/data/resources";
import WellbeingTools from "@/components/resources/WellbeingTools";

export default function Resources() {
  return (
    <main className="flex-1 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Wellbeing <span className="text-primary-600 dark:text-primary-400">Resources</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Explore our curated collection of tools, articles, and expert guidance to support your wellbeing journey.
          </p>
        </div>

        <Tabs defaultValue="articles" className="mb-16">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="experts">Expert Advice</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="articles">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ResourceCard 
                  key={article.id}
                  category={article.category}
                  title={article.title}
                  description={article.description}
                  link={`/article/${article.id}`}
                  imageAlt={article.title}
                  tagColor={article.tagColor}
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline">View All Articles</Button>
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="container mx-auto max-w-4xl py-4">
              <WellbeingTools />
              
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-xl font-bold mb-4 text-center dark:text-white">More Tools Coming Soon</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="overflow-hidden bg-gray-50 dark:bg-slate-800 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-gray-600 dark:text-gray-400">Meditation Timer</CardTitle>
                      <CardDescription>Coming soon</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="overflow-hidden bg-gray-50 dark:bg-slate-800 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-gray-600 dark:text-gray-400">Habit Builder</CardTitle>
                      <CardDescription>Coming soon</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="overflow-hidden bg-gray-50 dark:bg-slate-800 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-gray-600 dark:text-gray-400">Reading Recommendations</CardTitle>
                      <CardDescription>Coming soon</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experts">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Dr. Sarah Johnson</CardTitle>
                      <CardDescription>Clinical Psychologist, Stress Specialist</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Dr. Johnson specializes in stress management and resilience building. With over 15 years of clinical experience,
                    she helps individuals develop practical strategies to navigate high-pressure environments and build sustainable wellbeing practices.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">View Articles</Button>
                    <Button size="sm">Book Consultation</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Professor Michael Lee</CardTitle>
                      <CardDescription>Neuroscientist, Sleep Researcher</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Prof. Lee conducts groundbreaking research on sleep's impact on cognitive performance and emotional regulation.
                    His work helps people understand how quality sleep forms the foundation for overall wellbeing and daily functioning.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">View Articles</Button>
                    <Button size="sm">Book Consultation</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Dr. Maya Patel</CardTitle>
                      <CardDescription>Nutritionist, Lifestyle Medicine Expert</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Dr. Patel integrates nutritional science with behavioral psychology to help people develop sustainable eating habits.
                    Her holistic approach emphasizes the connection between nutrition, physical health, and mental wellbeing.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">View Articles</Button>
                    <Button size="sm">Book Consultation</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle>James Wilson, CFP</CardTitle>
                      <CardDescription>Financial Wellbeing Specialist</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    James specializes in reducing financial stress and creating balanced approaches to money management.
                    He combines financial planning expertise with wellbeing principles to help people develop healthier relationships with money.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">View Articles</Button>
                    <Button size="sm">Book Consultation</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline">View All Experts</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Join Our Wellbeing Community</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get exclusive access to our latest resources, expert-led webinars, and connect with others on similar wellbeing journeys.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input 
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need Personalized Guidance?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Start with our comprehensive wellbeing assessments to get tailored recommendations based on your unique profile.
          </p>
          <Link href="/assessments">
            <Button size="lg" className="px-8">Take an Assessment</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

// Resource card component for the articles section
function ResourceCard({ 
  category, 
  title, 
  description, 
  link, 
  imageAlt, 
  tagColor 
}: { 
  category: string; 
  title: string; 
  description: string; 
  link: string; 
  imageAlt: string;
  tagColor: string;
}) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md dark:border-gray-700">
      <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <CardHeader className="pb-2">
        <div className="mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${tagColor}`}>
            {category}
          </span>
        </div>
        <CardTitle className="text-xl dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">{description}</CardDescription>
        <Link href={link}>
          <Button variant="outline" size="sm" className="w-full">Read Article</Button>
        </Link>
      </CardContent>
    </Card>
  );
}