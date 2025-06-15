"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Trophy, Calendar, Target, Star, Zap } from "lucide-react"

interface GoalVisualizationProps {
  path: any
}

export default function GoalVisualization({ path }: GoalVisualizationProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null)

  const milestones = [
    {
      id: "milestone-1",
      title: "Foundation Complete",
      description: "Master the fundamental concepts",
      week: 2,
      completed: true,
      reward: "🎯 First Steps Badge",
      tasks: ["Complete Module 1", "Take Foundation Quiz", "Submit Reflection"],
      completedTasks: 3,
      totalTasks: 3,
    },
    {
      id: "milestone-2",
      title: "Practical Application",
      description: "Apply knowledge to real scenarios",
      week: 4,
      completed: true,
      reward: "🚀 Momentum Builder Badge",
      tasks: ["Complete Module 2", "Practice Exercises", "Case Study Analysis"],
      completedTasks: 3,
      totalTasks: 3,
    },
    {
      id: "milestone-3",
      title: "Advanced Mastery",
      description: "Deep dive into advanced concepts",
      week: 6,
      completed: false,
      reward: "⭐ Advanced Learner Badge",
      tasks: ["Complete Module 3", "Advanced Project", "Peer Review"],
      completedTasks: 1,
      totalTasks: 3,
    },
    {
      id: "milestone-4",
      title: "Integration & Synthesis",
      description: "Combine all learnings into mastery",
      week: 8,
      completed: false,
      reward: "👑 Path Master Badge",
      tasks: ["Complete Module 4", "Final Project", "Mentor Session"],
      completedTasks: 0,
      totalTasks: 3,
    },
  ]

  const achievements = [
    { id: "streak-7", title: "7-Day Streak", icon: "🔥", unlocked: true },
    { id: "early-bird", title: "Early Bird", icon: "🌅", unlocked: true },
    { id: "perfectionist", title: "Perfect Score", icon: "💯", unlocked: false },
    { id: "helper", title: "Community Helper", icon: "🤝", unlocked: false },
  ]

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Learning Journey Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>50% Complete</span>
            </div>
            <Progress value={50} className="h-3" />
            <p className="text-xs text-gray-600 mt-1">2 of 4 milestones completed</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                      milestone.completed
                        ? "bg-green-600 text-white"
                        : index === 2
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {milestone.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : index === 2 ? (
                      <Zap className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedMilestone?.id === milestone.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedMilestone(milestone)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{milestone.title}</h3>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                          <Badge variant={milestone.completed ? "default" : "outline"}>Week {milestone.week}</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {milestone.completedTasks}/{milestone.totalTasks} tasks completed
                          </div>
                          {milestone.completed && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <Trophy className="w-4 h-4" />
                              <span>{milestone.reward}</span>
                            </div>
                          )}
                        </div>

                        <Progress
                          value={(milestone.completedTasks / milestone.totalTasks) * 100}
                          className="h-2 mt-2"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Details */}
      {selectedMilestone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedMilestone.title} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Tasks to Complete:</h4>
                <div className="space-y-2">
                  {selectedMilestone.tasks.map((task: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle
                        className={`w-4 h-4 ${
                          index < selectedMilestone.completedTasks ? "text-green-600" : "text-gray-300"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          index < selectedMilestone.completedTasks ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Milestone Reward:</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">{selectedMilestone.reward}</span>
                  </div>
                  <p className="text-sm text-gray-600">Unlock this achievement by completing all milestone tasks</p>
                </div>

                {!selectedMilestone.completed && <Button className="w-full mt-4">Continue Learning</Button>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Achievement Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`text-center p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked ? "border-yellow-200 bg-yellow-50" : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-medium text-sm">{achievement.title}</h4>
                {achievement.unlocked && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
