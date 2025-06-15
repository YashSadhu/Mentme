"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Target, Brain, Heart, Calendar, Award, Lightbulb, Timer, Star } from "lucide-react"
import { useTaskEngine, generateMorningPrompt, generateEveningPrompt } from "@/lib/task-engine"

export default function DailyTaskManager() {
  const {
    dailyTasks,
    stretchChallenges,
    moodEntries,
    currentDifficulty,
    weeklyPerformance,
    generateDailyTask,
    completeTask,
    addMoodEntry,
    generateStretchChallenge,
    getAccountabilityCheck,
    adjustDifficulty,
    getWeeklySpiritual,
    getRecurringThemes,
  } = useTaskEngine()

  const [selectedMood, setSelectedMood] = useState("")
  const [currentTask, setCurrentTask] = useState<any>(null)
  const [taskStartTime, setTaskStartTime] = useState<number | null>(null)
  const [reflection, setReflection] = useState("")
  const [showEveningPrompt, setShowEveningPrompt] = useState(false)
  const [eveningReflection, setEveningReflection] = useState("")
  const [activeTab, setActiveTab] = useState("today")

  const today = new Date().toISOString().split("T")[0]
  const todaysTasks = dailyTasks.filter((task) => task.date === today)
  const isWeekend = new Date().getDay() === 0 // Sunday
  const isFriday = new Date().getDay() === 5

  useEffect(() => {
    // Auto-generate today's task if none exists
    if (todaysTasks.length === 0 && selectedMood) {
      const task = generateDailyTask(today, selectedMood)
      setCurrentTask(task)
    }
  }, [selectedMood, todaysTasks.length])

  useEffect(() => {
    // Generate stretch challenge on Sundays
    if (isWeekend && stretchChallenges.filter((c) => c.weekOf === today).length === 0) {
      generateStretchChallenge()
    }
  }, [isWeekend])

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood)
    const moodEntry = addMoodEntry(mood)

    if (todaysTasks.length === 0) {
      const task = generateDailyTask(today, mood)
      setCurrentTask(task)
    }
  }

  const handleStartTask = (task: any) => {
    setCurrentTask(task)
    setTaskStartTime(Date.now())
  }

  const handleCompleteTask = () => {
    if (!currentTask || !taskStartTime) return

    const completionTime = Math.round((Date.now() - taskStartTime) / 60000) // minutes
    completeTask(currentTask.id, completionTime, reflection)

    // Schedule evening reflection
    setTimeout(() => {
      setShowEveningPrompt(true)
    }, 5000) // Show after 5 seconds

    setCurrentTask(null)
    setTaskStartTime(null)
    setReflection("")
    adjustDifficulty()
  }

  const moods = [
    { value: "motivated", label: "Motivated", icon: "🚀", color: "bg-green-100 text-green-800" },
    { value: "anxious", label: "Anxious", icon: "😰", color: "bg-yellow-100 text-yellow-800" },
    { value: "peaceful", label: "Peaceful", icon: "🧘", color: "bg-blue-100 text-blue-800" },
    { value: "overwhelmed", label: "Overwhelmed", icon: "😵", color: "bg-red-100 text-red-800" },
    { value: "focused", label: "Focused", icon: "🎯", color: "bg-purple-100 text-purple-800" },
    { value: "tired", label: "Tired", icon: "😴", color: "bg-gray-100 text-gray-800" },
  ]

  const todaysMood = moodEntries.find((entry) => entry.date.split("T")[0] === today)
  const weeklyStretchChallenge = stretchChallenges.find((c) => c.weekOf === today)
  const completedTasksThisWeek = dailyTasks.filter(
    (t) => t.completed && new Date(t.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Daily Growth Journey</h1>
          <p className="text-gray-600">Focused tasks, mindful reflection, and continuous growth</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="stretch">Stretch Challenge</TabsTrigger>
            <TabsTrigger value="reflection">Reflection</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="vision">Vision</TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-6">
            {/* Morning Mood Check */}
            {!todaysMood && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    How are you feeling this morning?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {moods.map((mood) => (
                      <Button
                        key={mood.value}
                        variant="outline"
                        className={`h-16 flex flex-col gap-1 ${selectedMood === mood.value ? mood.color : ""}`}
                        onClick={() => handleMoodSelection(mood.value)}
                      >
                        <span className="text-2xl">{mood.icon}</span>
                        <span className="text-sm">{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                  {todaysMood?.morningExercise && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Morning Exercise:</strong> {todaysMood.morningExercise}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Today's Task */}
            {currentTask && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Today's Focused Task
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {currentTask.difficulty} • {currentTask.estimatedMinutes} min
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{currentTask.title}</h3>
                    <p className="text-gray-600 mt-2">{currentTask.description}</p>
                  </div>

                  {todaysMood && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">{generateMorningPrompt(todaysMood.mood, currentTask)}</p>
                    </div>
                  )}

                  {!taskStartTime ? (
                    <Button onClick={() => handleStartTask(currentTask)} className="w-full">
                      <Timer className="w-4 h-4 mr-2" />
                      Start Task
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <Clock className="w-4 h-4" />
                        <span>Task in progress...</span>
                      </div>

                      <Textarea
                        placeholder="Jot down thoughts or insights as you work..."
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        rows={3}
                      />

                      <Button onClick={handleCompleteTask} className="w-full">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Evening Reflection Prompt */}
            {showEveningPrompt && currentTask && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Lightbulb className="w-5 h-5" />
                    Evening Reflection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-700">{generateEveningPrompt(currentTask)}</p>
                  <Textarea
                    placeholder="Share your reflections..."
                    value={eveningReflection}
                    onChange={(e) => setEveningReflection(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={() => setShowEveningPrompt(false)} className="w-full">
                    Save Reflection
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Friday Spiritual Question */}
            {isFriday && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Brain className="w-5 h-5" />
                    Weekly Spiritual Reflection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 mb-4">{getWeeklySpiritual()}</p>
                  <Textarea placeholder="Take time to reflect deeply..." rows={4} />
                  <Button className="mt-4 w-full">Save Spiritual Reflection</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Stretch Challenge Tab */}
          <TabsContent value="stretch" className="space-y-6">
            {weeklyStretchChallenge ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    This Week's Stretch Challenge
                  </CardTitle>
                  <Badge variant="outline">20-30% beyond comfort zone</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{weeklyStretchChallenge.title}</h3>
                    <p className="text-gray-600 mt-2">{weeklyStretchChallenge.description}</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Why this challenge:</strong> {weeklyStretchChallenge.rationale}
                    </p>
                  </div>

                  {!weeklyStretchChallenge.completed ? (
                    <Button className="w-full">
                      <Star className="w-4 h-4 mr-2" />
                      Accept Challenge
                    </Button>
                  ) : (
                    <div className="text-center text-green-600">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <p>Challenge Completed!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your weekly stretch challenge will appear on Sunday</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reflection Tab */}
          <TabsContent value="reflection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Milestone Reflection</CardTitle>
                <p className="text-sm text-gray-600">After every completed task or challenge, reflect on your growth</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What did I learn about myself while doing this?
                  </label>
                  <Textarea placeholder="Reflect on your self-discovery..." rows={3} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">What can I improve next time?</label>
                  <Textarea placeholder="Identify areas for growth..." rows={3} />
                </div>

                <Button className="w-full">Save Milestone Reflection</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recurring Themes</CardTitle>
                <p className="text-sm text-gray-600">Patterns identified from your reflections</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getRecurringThemes().map((theme, index) => (
                    <Badge key={index} variant="secondary">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{completedTasksThisWeek}/7</div>
                  <Progress value={(completedTasksThisWeek / 7) * 100} className="mb-2" />
                  <p className="text-sm text-gray-600">Tasks completed this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{currentDifficulty}%</div>
                  <Progress value={currentDifficulty} className="mb-2" />
                  <p className="text-sm text-gray-600">Adaptive challenge level</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avg. Completion Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {weeklyPerformance.length > 0
                      ? Math.round(weeklyPerformance.reduce((a, b) => a + b, 0) / weeklyPerformance.length)
                      : 0}
                    m
                  </div>
                  <p className="text-sm text-gray-600">Average time per task</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Accountability Check</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">{getAccountabilityCheck()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vision Tab */}
          <TabsContent value="vision" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Quarterly Vision Review
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Scheduled every quarter to revisit and refine your 5-year vision
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Next vision review: March 2024</p>
                  <Button variant="outline">Schedule Early Review</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annual Legacy Letter</CardTitle>
                <p className="text-sm text-gray-600">
                  Write to your future self about achievements, lessons, and hopes
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Next legacy letter: December 2024</p>
                  <Button variant="outline">View Previous Letters</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
