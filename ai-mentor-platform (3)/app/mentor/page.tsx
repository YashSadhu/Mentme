'use client';

import { useState } from 'react';
import DailyTaskManager from '@/components/daily-task-manager';
import VisionReview from '@/components/vision-review';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Calendar, Star, Heart } from "lucide-react";

export default function MentorPage() {
  const [showVisionReview, setShowVisionReview] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mentor Dashboard</h1>
          <p className="text-gray-600">Your personalized growth and learning journey</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">
              <Target className="w-4 h-4 mr-2" />
              Daily Tasks
            </TabsTrigger>
            <TabsTrigger value="vision">
              <Calendar className="w-4 h-4 mr-2" />
              Vision Review
            </TabsTrigger>
            <TabsTrigger value="progress">
              <Star className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Brain className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <DailyTaskManager />
          </TabsContent>

          <TabsContent value="vision" className="mt-6">
            {showVisionReview ? (
              <VisionReview onBack={() => setShowVisionReview(false)} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Quarterly Vision Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Take time to reflect on your progress, adjust your vision, and plan for the next quarter.
                  </p>
                  <button
                    onClick={() => setShowVisionReview(true)}
                    className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Start Vision Review
                  </button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Task Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">85%</p>
                      <p className="text-sm text-gray-600">Last 30 days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stretch Challenges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-purple-600">3/4</p>
                      <p className="text-sm text-gray-600">This quarter</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Learning Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-600">12 days</p>
                      <p className="text-sm text-gray-600">Current streak</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Learning Patterns</h3>
                    <p className="text-blue-700">
                      You perform best in the morning hours and show strong progress in technical skills.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Growth Areas</h3>
                    <p className="text-green-700">
                      Consider focusing more on practical applications of theoretical concepts.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Recommendations</h3>
                    <p className="text-purple-700">
                      Try incorporating more hands-on projects to reinforce your learning.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 