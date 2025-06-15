"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Target, TrendingUp, Star, ArrowLeft, Save } from "lucide-react"

interface VisionReviewProps {
  onBack: () => void
}

export default function VisionReview({ onBack }: VisionReviewProps) {
  const [currentVision, setCurrentVision] = useState("")
  const [quarterlyMilestones, setQuarterlyMilestones] = useState<string[]>([])
  const [achievements, setAchievements] = useState<string[]>([])
  const [adjustments, setAdjustments] = useState<string[]>([])
  const [nextQuarterFocus, setNextQuarterFocus] = useState<string[]>([])
  const [newMilestone, setNewMilestone] = useState("")
  const [newAchievement, setNewAchievement] = useState("")
  const [newAdjustment, setNewAdjustment] = useState("")
  const [newFocus, setNewFocus] = useState("")

  const currentQuarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`

  const addItem = (
    item: string,
    setter: (items: string[]) => void,
    current: string[],
    inputSetter: (value: string) => void,
  ) => {
    if (item.trim()) {
      setter([...current, item.trim()])
      inputSetter("")
    }
  }

  const removeItem = (index: number, setter: (items: string[]) => void, current: string[]) => {
    setter(current.filter((_, i) => i !== index))
  }

  const handleSaveReview = () => {
    const review = {
      id: `review-${Date.now()}`,
      date: new Date().toISOString(),
      quarter: currentQuarter,
      year: new Date().getFullYear(),
      fiveYearVision: currentVision,
      quarterlyMilestones,
      achievements,
      adjustments,
      nextQuarterFocus,
    }

    console.log("Saving vision review:", review)
    // Here you would save to your task engine
    onBack()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Quarterly Vision Review</h1>
              <p className="text-gray-600">{currentQuarter} • 1-hour deep reflection</p>
            </div>
          </div>
          <Button onClick={handleSaveReview}>
            <Save className="w-4 h-4 mr-2" />
            Save Review
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Tabs defaultValue="vision" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vision">5-Year Vision</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="planning">Next Quarter</TabsTrigger>
          </TabsList>

          <TabsContent value="vision" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Your 5-Year Vision
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Revisit and refine your long-term vision. What do you want your life to look like in 5 years?
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your 5-year vision in detail. Include career goals, personal growth, family aspirations, and the impact you want to make..."
                  value={currentVision}
                  onChange={(e) => setCurrentVision(e.target.value)}
                  rows={8}
                  className="w-full"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Reflection Prompts</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• What has changed since your last vision review?</li>
                      <li>• What new opportunities have emerged?</li>
                      <li>• What obstacles have you overcome?</li>
                      <li>• How has your family influenced your direction?</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Vision Areas</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Career & Professional Growth</li>
                      <li>• Personal Development & Skills</li>
                      <li>• Family & Relationships</li>
                      <li>• Health & Well-being</li>
                      <li>• Financial Goals</li>
                      <li>• Legacy & Impact</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Quarter-Specific Milestones
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Break down your 5-year vision into specific milestones for this quarter
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a milestone for this quarter..."
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(newMilestone, setQuarterlyMilestones, quarterlyMilestones, setNewMilestone)
                      }
                    }}
                  />
                  <Button
                    onClick={() => addItem(newMilestone, setQuarterlyMilestones, quarterlyMilestones, setNewMilestone)}
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {quarterlyMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span>{milestone}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index, setQuarterlyMilestones, quarterlyMilestones)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Achievements & Progress
                </CardTitle>
                <p className="text-sm text-gray-600">Celebrate what you've accomplished since your last review</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an achievement or progress made..."
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(newAchievement, setAchievements, achievements, setNewAchievement)
                      }
                    }}
                  />
                  <Button onClick={() => addItem(newAchievement, setAchievements, achievements, setNewAchievement)}>
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span>{achievement}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index, setAchievements, achievements)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Adjustments & Learnings
                </CardTitle>
                <p className="text-sm text-gray-600">What adjustments do you need to make based on your experiences?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an adjustment or learning..."
                    value={newAdjustment}
                    onChange={(e) => setNewAdjustment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(newAdjustment, setAdjustments, adjustments, setNewAdjustment)
                      }
                    }}
                  />
                  <Button onClick={() => addItem(newAdjustment, setAdjustments, adjustments, setNewAdjustment)}>
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {adjustments.map((adjustment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span>{adjustment}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(index, setAdjustments, adjustments)}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Next Quarter Focus
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Based on your vision and learnings, what will you focus on next quarter?
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a focus area for next quarter..."
                    value={newFocus}
                    onChange={(e) => setNewFocus(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(newFocus, setNextQuarterFocus, nextQuarterFocus, setNewFocus)
                      }
                    }}
                  />
                  <Button onClick={() => addItem(newFocus, setNextQuarterFocus, nextQuarterFocus, setNewFocus)}>
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {nextQuarterFocus.map((focus, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>{focus}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index, setNextQuarterFocus, nextQuarterFocus)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">This Quarter</h4>
                    <div className="space-y-1">
                      <Badge variant="outline">{quarterlyMilestones.length} Milestones</Badge>
                      <Badge variant="outline">{achievements.length} Achievements</Badge>
                      <Badge variant="outline">{adjustments.length} Adjustments</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Next Quarter</h4>
                    <div className="space-y-1">
                      <Badge variant="outline">{nextQuarterFocus.length} Focus Areas</Badge>
                      <Badge variant="secondary">Ready to Execute</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
