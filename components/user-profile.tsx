"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, User, Calendar, Target, Award, TrendingUp, Clock, BookOpen, Star } from "lucide-react"
import { useUserStore, initializeDemoUser } from "@/lib/user-store"

interface UserProfileProps {
  onBack: () => void
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const { user, setUser, isAuthenticated } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    goals: [] as string[],
    favoriteTopics: [] as string[],
  })

  useEffect(() => {
    if (!isAuthenticated) {
      initializeDemoUser()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        goals: user.preferences.goals,
        favoriteTopics: user.preferences.favoriteTopics,
      })
    }
  }, [user])

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: editForm.name,
        email: editForm.email,
        preferences: {
          ...user.preferences,
          goals: editForm.goals,
          favoriteTopics: editForm.favoriteTopics,
        },
      })
      setIsEditing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Profile...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Your Profile</h1>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Your name"
                    />
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Your email"
                      type="email"
                    />
                    <Button onClick={handleSave} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-xl">{user.name}</CardTitle>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </CardHeader>
            </Card>

            {/* Progress Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sessions</span>
                  <Badge variant="secondary">{user.progress.totalSessions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Minutes</span>
                  <Badge variant="secondary">{user.progress.totalMinutes}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <Badge variant="secondary">{user.progress.streakDays} days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Journal Entries</span>
                  <Badge variant="secondary">{user.progress.journalEntries}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editForm.goals.join("\n")}
                    onChange={(e) => setEditForm({ ...editForm, goals: e.target.value.split("\n").filter(Boolean) })}
                    placeholder="Enter your goals (one per line)"
                    rows={4}
                  />
                ) : (
                  <div className="space-y-2">
                    {user.preferences.goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span>{goal}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Favorite Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input
                    value={editForm.favoriteTopics.join(", ")}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        favoriteTopics: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Enter topics separated by commas"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.favoriteTopics.map((topic, index) => (
                      <Badge key={index} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.mentorshipHistory.slice(0, 5).map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{session.mentorName}</p>
                        <p className="text-sm text-gray-600">{session.sessionType}</p>
                        <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{session.duration} min</p>
                        {session.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{session.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {user.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
