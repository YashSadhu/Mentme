"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Target, CheckCircle, TrendingUp, Award, BookOpen, Play, Users, AlertCircle } from "lucide-react"
import { format } from "date-fns"

interface LearningPlanProps {
  path: any
}

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: Date
  completed: boolean
  progress: number
  resources: Array<{
    id: string
    title: string
    type: "video" | "article" | "course" | "book"
    duration: string
    completed: boolean
  }>
}

interface WeeklyGoal {
  week: number
  title: string
  description: string
  estimatedHours: number
  completedHours: number
  tasks: Array<{
    id: string
    title: string
    type: string
    duration: string
    completed: boolean
    dueDate: Date
  }>
}

export default function LearningPlan({ path }: LearningPlanProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [activeTab, setActiveTab] = useState("overview")
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([])
  const [studyStreak, setStudyStreak] = useState(0)
  const [totalStudyTime, setTotalStudyTime] = useState(0)

  useEffect(() => {
    // Initialize learning plan data
    initializeLearningPlan()
    loadProgressData()
  }, [path.id])

  const initializeLearningPlan = () => {
    const today = new Date()

    // Generate milestones based on path
    const pathMilestones: Milestone[] = [
      {
        id: "milestone-1",
        title: "Foundation Mastery",
        description: "Complete core concepts and fundamental principles",
        targetDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        completed: false,
        progress: 65,
        resources: [
          { id: "r1", title: "Introduction Video", type: "video", duration: "45 min", completed: true },
          { id: "r2", title: "Core Principles Article", type: "article", duration: "15 min", completed: true },
          { id: "r3", title: "Foundation Course", type: "course", duration: "2 hours", completed: false },
        ],
      },
      {
        id: "milestone-2",
        title: "Practical Application",
        description: "Apply knowledge through hands-on exercises and projects",
        targetDate: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000), // 4 weeks
        completed: false,
        progress: 30,
        resources: [
          { id: "r4", title: "Case Study Analysis", type: "article", duration: "30 min", completed: false },
          { id: "r5", title: "Expert Interview", type: "video", duration: "1 hour", completed: false },
          { id: "r6", title: "Practical Exercises", type: "course", duration: "3 hours", completed: false },
        ],
      },
      {
        id: "milestone-3",
        title: "Advanced Mastery",
        description: "Deep dive into advanced concepts and strategies",
        targetDate: new Date(today.getTime() + 42 * 24 * 60 * 60 * 1000), // 6 weeks
        completed: false,
        progress: 0,
        resources: [
          { id: "r7", title: "Advanced Strategies Book", type: "book", duration: "8 hours", completed: false },
          { id: "r8", title: "Masterclass Series", type: "video", duration: "4 hours", completed: false },
          { id: "r9", title: "Expert Podcast", type: "article", duration: "1 hour", completed: false },
        ],
      },
    ]

    // Generate weekly goals
    const pathWeeklyGoals: WeeklyGoal[] = [
      {
        week: 1,
        title: "Getting Started",
        description: "Build foundation knowledge and establish learning routine",
        estimatedHours: 5,
        completedHours: 3.5,
        tasks: [
          {
            id: "t1",
            title: "Watch introduction videos",
            type: "video",
            duration: "2 hours",
            completed: true,
            dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: "t2",
            title: "Read core principles",
            type: "article",
            duration: "1 hour",
            completed: true,
            dueDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
          },
          {
            id: "t3",
            title: "Complete first assessment",
            type: "course",
            duration: "30 min",
            completed: false,
            dueDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        week: 2,
        title: "Deep Dive",
        description: "Explore advanced concepts and practical applications",
        estimatedHours: 6,
        completedHours: 1,
        tasks: [
          {
            id: "t4",
            title: "Advanced video series",
            type: "video",
            duration: "3 hours",
            completed: false,
            dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
          },
          {
            id: "t5",
            title: "Case study analysis",
            type: "article",
            duration: "2 hours",
            completed: false,
            dueDate: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
          },
          {
            id: "t6",
            title: "Practice exercises",
            type: "course",
            duration: "1 hour",
            completed: true,
            dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    ]

    setMilestones(pathMilestones)
    setWeeklyGoals(pathWeeklyGoals)
  }

  const loadProgressData = () => {
    // Load from localStorage or API
    const savedStreak = localStorage.getItem(`study-streak-${path.id}`)
    const savedTime = localStorage.getItem(`study-time-${path.id}`)

    if (savedStreak) setStudyStreak(Number.parseInt(savedStreak))
    if (savedTime) setTotalStudyTime(Number.parseInt(savedTime))
  }

  const toggleTaskComplete = (weekIndex: number, taskIndex: number) => {
    const newWeeklyGoals = [...weeklyGoals]
    const task = newWeeklyGoals[weekIndex].tasks[taskIndex]
    task.completed = !task.completed

    // Update completed hours
    const taskHours = Number.parseFloat(task.duration.split(" ")[0])
    if (task.completed) {
      newWeeklyGoals[weekIndex].completedHours += taskHours
      setTotalStudyTime((prev) => prev + taskHours)
    } else {
      newWeeklyGoals[weekIndex].completedHours -= taskHours
      setTotalStudyTime((prev) => prev - taskHours)
    }

    setWeeklyGoals(newWeeklyGoals)

    // Save progress
    localStorage.setItem(`study-time-${path.id}`, totalStudyTime.toString())
  }

  const toggleResourceComplete = (milestoneIndex: number, resourceIndex: number) => {
    const newMilestones = [...milestones]
    const resource = newMilestones[milestoneIndex].resources[resourceIndex]
    resource.completed = !resource.completed

    // Recalculate milestone progress
    const milestone = newMilestones[milestoneIndex]
    const completedResources = milestone.resources.filter((r) => r.completed).length
    milestone.progress = Math.round((completedResources / milestone.resources.length) * 100)
    milestone.completed = milestone.progress === 100

    setMilestones(newMilestones)
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />
      case "article":
        return <BookOpen className="w-4 h-4" />
      case "course":
        return <Users className="w-4 h-4" />
      case "book":
        return <BookOpen className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getOverallProgress = () => {
    const totalMilestones = milestones.length
    const completedMilestones = milestones.filter((m) => m.completed).length
    return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
  }

  const getWeeklyProgress = () => {
    const totalHours = weeklyGoals.reduce((sum, week) => sum + week.estimatedHours, 0)
    const completedHours = weeklyGoals.reduce((sum, week) => sum + week.completedHours, 0)
    return totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0
  }

  const getUpcomingDeadlines = () => {
    const allTasks = weeklyGoals.flatMap((week) => week.tasks)
    const upcomingTasks = allTasks
      .filter((task) => !task.completed && task.dueDate > new Date())
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 3)

    return upcomingTasks
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Plan</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">{getOverallProgress()}%</div>
                <Progress value={getOverallProgress()} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">
                  {milestones.filter((m) => m.completed).length} of {milestones.length} milestones completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">{studyStreak}</div>
                <p className="text-sm text-gray-600">days in a row</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-xs text-gray-500">Keep it up!</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Study Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalStudyTime}h</div>
                <p className="text-sm text-gray-600">total time invested</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-xs text-gray-500">
                    This week: {weeklyGoals.reduce((sum, week) => sum + week.completedHours, 0)}h
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getUpcomingDeadlines().map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getResourceIcon(task.type)}
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">Due {format(task.dueDate, "MMM d")}</p>
                      <p className="text-xs text-gray-500">
                        {Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                      </p>
                    </div>
                  </div>
                ))}
                {getUpcomingDeadlines().length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">🎯</div>
                  <div>
                    <p className="font-medium">First Milestone Reached</p>
                    <p className="text-sm text-gray-600">Completed foundation concepts</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    New
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">🔥</div>
                  <div>
                    <p className="font-medium">5-Day Streak</p>
                    <p className="text-sm text-gray-600">Consistent daily learning</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <div className="space-y-6">
            {milestones.map((milestone, milestoneIndex) => (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          milestone.completed ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {milestone.completed ? <CheckCircle className="w-5 h-5" /> : milestoneIndex + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Due {format(milestone.targetDate, "MMM d, yyyy")}</p>
                      <Badge variant={milestone.completed ? "default" : "outline"}>
                        {milestone.completed ? "Completed" : `${milestone.progress}% Complete`}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Progress value={milestone.progress} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Resources:</h4>
                    {milestone.resources.map((resource, resourceIndex) => (
                      <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleResourceComplete(milestoneIndex, resourceIndex)}
                          >
                            {resource.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                          </Button>
                          {getResourceIcon(resource.type)}
                          <div>
                            <p className={`font-medium ${resource.completed ? "line-through text-gray-500" : ""}`}>
                              {resource.title}
                            </p>
                            <p className="text-sm text-gray-600">{resource.duration}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {resource.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <div className="space-y-6">
            {weeklyGoals.map((week, weekIndex) => (
              <Card key={week.week}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Week {week.week}: {week.title}
                      </CardTitle>
                      <p className="text-gray-600">{week.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {week.completedHours}h / {week.estimatedHours}h
                      </p>
                      <Badge variant={week.completedHours >= week.estimatedHours ? "default" : "outline"}>
                        {Math.round((week.completedHours / week.estimatedHours) * 100)}% Complete
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Progress value={(week.completedHours / week.estimatedHours) * 100} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Tasks:</h4>
                    {week.tasks.map((task, taskIndex) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm" onClick={() => toggleTaskComplete(weekIndex, taskIndex)}>
                            {task.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                          </Button>
                          {getResourceIcon(task.type)}
                          <div>
                            <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                              {task.title}
                            </p>
                            <p className="text-sm text-gray-600">{task.duration}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Due {format(task.dueDate, "MMM d")}</p>
                          <Badge variant="outline" className="capitalize">
                            {task.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Calendar</CardTitle>
                  <p className="text-gray-600">Schedule and track your learning sessions</p>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                      <div>
                        <p className="font-medium">Morning Study</p>
                        <p className="text-sm text-gray-600">9:00 AM - 10:30 AM</p>
                        <p className="text-xs text-gray-500">Video: Advanced Concepts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-8 bg-green-600 rounded-full"></div>
                      <div>
                        <p className="font-medium">Practice Session</p>
                        <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
                        <p className="text-xs text-gray-500">Exercises & Review</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
                      <div>
                        <p className="font-medium">Mentor Session</p>
                        <p className="text-sm text-gray-600">7:00 PM - 7:30 PM</p>
                        <p className="text-xs text-gray-500">Q&A with {path.mentor}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Study Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily study reminder</span>
                      <Badge variant="outline">9:00 AM</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly review</span>
                      <Badge variant="outline">Sunday</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Milestone check</span>
                      <Badge variant="outline">Monthly</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
