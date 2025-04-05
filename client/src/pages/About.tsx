import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function About() {
  return (
    <main className="flex-1 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            About <span className="text-primary-600">Wellbeing Compass</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Your trusted partner in the journey toward holistic wellbeing and personal growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At Wellbeing Compass, we're dedicated to empowering individuals on their journey toward holistic wellbeing. 
              We believe that true wellness encompasses multiple dimensions of life, from mental and emotional health to 
              physical vitality, social connections, and purposeful living.
            </p>
            <p className="text-gray-600 mb-4">
              Our mission is to provide accessible, evidence-based assessments and personalized guidance that helps you 
              understand your wellbeing profile, identify areas for growth, and take meaningful steps toward a more 
              balanced and fulfilling life.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h2>
            <p className="text-gray-600 mb-4">
              We've developed a comprehensive suite of 15 wellbeing assessments spanning critical areas from stress management 
              and emotional wellbeing to financial wellness and life purpose. Each assessment is carefully designed based on 
              established psychological frameworks and validated research.
            </p>
            <p className="text-gray-600">
              What sets us apart is our integrated approach to wellbeing. Rather than viewing different aspects of health in 
              isolation, we help you see the interconnections and provide tailored recommendations that address the whole person.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Evidence-Based
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All our assessments and recommendations are grounded in scientific research and validated psychological principles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Privacy-Focused
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We prioritize your privacy and data security, ensuring that your personal information and assessment results remain confidential.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Empathetic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We approach wellbeing with compassion, recognizing that each person's journey is unique and deserving of respect.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Empowering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in equipping you with insights and tools that enable you to take ownership of your wellbeing journey.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Inclusive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We create content and tools that are accessible to people of diverse backgrounds, abilities, and life experiences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Growth-Oriented
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We embrace continuous improvement, both in our platform and in the paths we suggest for your personal development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-xl p-8 mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Team Behind Wellbeing Compass</h2>
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
              Our interdisciplinary team brings together expertise in psychology, health sciences, technology, and design.
              We're united by a passion for making wellbeing resources more accessible and personalized, helping individuals
              thrive in all dimensions of their lives.
            </p>
            <div className="inline-flex space-x-4">
              <Button variant="default">Meet Our Experts</Button>
              <Button variant="outline">Join Our Team</Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore our comprehensive assessments and gain personalized insights to enhance your wellbeing across all dimensions of life.
          </p>
          <Link href="/assessments">
            <Button size="lg" className="px-8">Start Your First Assessment</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}