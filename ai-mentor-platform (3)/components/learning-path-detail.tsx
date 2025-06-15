"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, BookOpen, Clock, Users, Star, Trophy, CheckCircle, TrendingUp, FileText, Activity } from "lucide-react"
import GoalVisualization from "@/components/goal-visualization"
import CuratedContent from "@/components/curated-content"
import GoogleTasksIntegration from "@/components/google-tasks-integration"
import LearningPlan from "@/components/learning-plan"

interface LearningPathDetailProps {
  path: any
  onBack: () => void
}

const mentorImages = {
  "Naval Ravikant": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "Andrew Huberman": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  "Marcus Aurelius": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "Swami Vivekananda": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=face",
  "Leonardo da Vinci": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150&h=150&fit=crop&crop=face",
  "Steve Jobs": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=150&h=150&fit=crop&crop=face",
}

export default function LearningPathDetail({ path, onBack }: LearningPathDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [pathProgress, setPathProgress] = useState({
    totalResources: 0,
    completedResources: 0,
    studyTime: 0,
    streak: 5,
  })

  useEffect(() => {
    // Load progress data
    const savedProgress = localStorage.getItem(`path-progress-${path.id}`)
    if (savedProgress) {
      setPathProgress(JSON.parse(savedProgress))
    }
  }, [path.id])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

  const handleProgressUpdate = (contentId: string, type: string, completed: boolean) => {
    const newProgress = { ...pathProgress }
    if (completed) {
      newProgress.completedResources += 1
      newProgress.studyTime += 0.5 // Add 30 minutes per resource
    } else {
      newProgress.completedResources -= 1
      newProgress.studyTime -= 0.5
    }

    setPathProgress(newProgress)
    localStorage.setItem(`path-progress-${path.id}`, JSON.stringify(newProgress))
  }

  const handleStartLearning = () => {
    setActiveTab("plan")
  }

  const modules = [
    {
      id: "module-1",
      title: "Foundation Principles",
      description: "Core concepts and fundamental understanding",
      lessons: 4,
      duration: "2 hours",
      completed: true,
      resources: 8,
      completedResources: 8,
    },
    {
      id: "module-2",
      title: "Practical Application",
      description: "Hands-on exercises and real-world examples",
      lessons: 5,
      duration: "3 hours",
      completed: true,
      resources: 12,
      completedResources: 10,
    },
    {
      id: "module-3",
      title: "Advanced Strategies",
      description: "Deep dive into advanced techniques",
      lessons: 6,
      duration: "4 hours",
      completed: false,
      resources: 15,
      completedResources: 4,
    },
    {
      id: "module-4",
      title: "Mastery & Integration",
      description: "Putting it all together for mastery",
      lessons: 4,
      duration: "2.5 hours",
      completed: false,
      resources: 10,
      completedResources: 0,
    },
  ]

  const totalResources = modules.reduce((sum, module) => sum + module.resources, 0)
  const totalCompletedResources = modules.reduce((sum, module) => sum + module.completedResources, 0)
  const overallProgress = Math.round((totalCompletedResources / totalResources) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Paths
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-16 h-16 rounded-lg ${path.color} flex items-center justify-center text-3xl`}>
                  {path.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{path.title}</h1>
                  <p className="text-gray-600">{path.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <Badge variant="outline">{path.difficulty}</Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {path.duration}
                </Badge>
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {path.participants.toLocaleString()} enrolled
                </Badge>
                <Badge variant="outline">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {path.rating}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">
                  {totalCompletedResources} of {totalResources} resources completed
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{pathProgress.studyTime}h</div>
                  <div className="text-xs text-gray-600">Study Time</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{pathProgress.streak}</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{modules.filter((m) => m.completed).length}</div>
                  <div className="text-xs text-gray-600">Modules Done</div>
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Mentor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        mentorImages[path.mentor as keyof typeof mentorImages] || "/placeholder.svg?height=60&width=60"
                      }
                      alt={path.mentor}
                      className="w-15 h-15 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{path.mentor}</h3>
                      <p className="text-sm text-gray-600">Your AI Mentor</p>
                    </div>
                  </div>
                  <Button className="w-full mb-3" onClick={handleStartLearning}>
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("content")}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plan">Learning Plan</TabsTrigger>
            <TabsTrigger value="content">Resources</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{path.overview}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">🎯</div>
                        <div>
                          <p className="font-medium text-sm">First Steps</p>
                          <p className="text-xs text-gray-600">Complete first module</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">🚀</div>
                        <div>
                          <p className="font-medium text-sm">Momentum Builder</p>
                          <p className="text-xs text-gray-600">Complete 2 modules</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-50">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">👑</div>
                        <div>
                          <p className="font-medium text-sm">Path Master</p>
                          <p className="text-xs text-gray-600">Complete entire path</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Learning Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Completion Rate</span>
                        <span className="font-medium">{overallProgress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Invested</span>
                        <span className="font-medium">{pathProgress.studyTime} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Streak</span>
                        <span className="font-medium">{pathProgress.streak} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Milestone</span>
                        <span className="font-medium">Module 3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Completion</span>
                        <span className="font-medium">3 weeks</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plan" className="mt-6">
            <LearningPlan path={path} />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <CuratedContent pathId={path.id} onProgressUpdate={handleProgressUpdate} />
          </TabsContent>

          <TabsContent value="roadmap" className="mt-6">
            <GoalVisualization path={path} />
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Study Groups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Wealth Building Beginners</p>
                        <p className="text-sm text-gray-600">124 members • Active daily</p>
                      </div>
                      <Button size="sm">Join</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Investment Strategies</p>
                        <p className="text-sm text-gray-600">89 members • Weekly discussions</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Joined
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Top Learners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Sarah Chen</p>
                        <p className="text-sm text-gray-600">98% completion • 45h study time</p>
                      </div>
                      <Badge variant="outline">🏆</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Mike Johnson</p>
                        <p className="text-sm text-gray-600">95% completion • 42h study time</p>
                      </div>
                      <Badge variant="outline">🥈</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Alex Rivera</p>
                        <p className="text-sm text-gray-600">92% completion • 38h study time</p>
                      </div>
                      <Badge variant="outline">🥉</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <GoogleTasksIntegration path={path} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
