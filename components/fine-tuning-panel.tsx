"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, RotateCcw, User, MessageSquare, Target, Clock, Brain, Lightbulb } from "lucide-react"
import { useState } from "react"

interface FineTuningPanelProps {
  settings: {
    tone: number
    fun: number
    seriousness: number
    practicality: number
    context: string
    goals: string[]
    learningStyle: string
    communicationFrequency: string
    feedbackStyle: string
    industryFocus: string
    meetingPreference: string
    challengeLevel: number
    empathy: number
    directness: number
    creativity: number
    analyticalDepth: number
    motivationalStyle: string
    timeCommitment: string
    preferredTopics: string[]
    avoidTopics: string[]
    personalityMatch: string
    responseLength: string
    useExamples: boolean
    useMetaphors: boolean
    includeResources: boolean
    trackProgress: boolean
  }
  onSettingsChange: (settings: any) => void
  onBack: () => void
}

export default function FineTuningPanel({ settings, onSettingsChange, onBack }: FineTuningPanelProps) {
  const [activeTab, setActiveTab] = useState("personality")

  const handleSliderChange = (key: string, value: number[]) => {
    onSettingsChange({
      ...settings,
      [key]: value[0],
    })
  }

  const handleInputChange = (key: string, value: string | boolean | string[]) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  const addGoal = (goal: string) => {
    if (goal && !settings.goals.includes(goal)) {
      handleInputChange("goals", [...settings.goals, goal])
    }
  }

  const removeGoal = (goal: string) => {
    handleInputChange(
      "goals",
      settings.goals.filter((g) => g !== goal),
    )
  }

  const addTopic = (topic: string, type: "preferred" | "avoid") => {
    const key = type === "preferred" ? "preferredTopics" : "avoidTopics"
    if (topic && !settings[key].includes(topic)) {
      handleInputChange(key, [...settings[key], topic])
    }
  }

  const removeTopic = (topic: string, type: "preferred" | "avoid") => {
    const key = type === "preferred" ? "preferredTopics" : "avoidTopics"
    handleInputChange(
      key,
      settings[key].filter((t) => t !== topic),
    )
  }

  const resetToDefaults = () => {
    onSettingsChange({
      tone: 50,
      fun: 30,
      seriousness: 70,
      practicality: 80,
      context: "",
      goals: [],
      learningStyle: "balanced",
      communicationFrequency: "weekly",
      feedbackStyle: "constructive",
      industryFocus: "general",
      meetingPreference: "flexible",
      challengeLevel: 60,
      empathy: 70,
      directness: 60,
      creativity: 50,
      analyticalDepth: 70,
      motivationalStyle: "encouraging",
      timeCommitment: "moderate",
      preferredTopics: [],
      avoidTopics: [],
      personalityMatch: "adaptive",
      responseLength: "medium",
      useExamples: true,
      useMetaphors: false,
      includeResources: true,
      trackProgress: true,
    })
  }

  const getLabel = (key: string, value: number) => {
    const labels = {
      tone: { 0: "Very Casual", 25: "Casual", 50: "Balanced", 75: "Professional", 100: "Very Formal" },
      fun: { 0: "Serious Only", 25: "Mostly Serious", 50: "Balanced", 75: "Engaging", 100: "Very Fun" },
      seriousness: { 0: "Very Light", 25: "Relaxed", 50: "Balanced", 75: "Focused", 100: "Very Serious" },
      practicality: { 0: "Theoretical", 25: "Mostly Theory", 50: "Balanced", 75: "Practical", 100: "Highly Practical" },
      challengeLevel: { 0: "Very Easy", 25: "Easy", 50: "Moderate", 75: "Challenging", 100: "Very Challenging" },
      empathy: { 0: "Direct", 25: "Straightforward", 50: "Balanced", 75: "Empathetic", 100: "Very Supportive" },
      directness: { 0: "Indirect", 25: "Gentle", 50: "Balanced", 75: "Direct", 100: "Very Direct" },
      creativity: { 0: "Traditional", 25: "Conventional", 50: "Balanced", 75: "Creative", 100: "Very Innovative" },
      analyticalDepth: { 0: "Surface", 25: "Basic", 50: "Moderate", 75: "Deep", 100: "Very Analytical" },
    }

    const ranges = [0, 25, 50, 75, 100]
    const closest = ranges.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev))
    return labels[key as keyof typeof labels][closest as keyof typeof labels.tone]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Personalize Your Mentoring Experience</h1>
              <p className="text-gray-600">Customize how your AI mentor interacts with you</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={onBack}>
              <Save className="w-4 h-4 mr-2" />
              Save & Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personality" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personality
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goals & Focus
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Learning Style
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="context" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Context
            </TabsTrigger>
          </TabsList>

          {/* Personality Tab */}
          <TabsContent value="personality" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Communication Tone
                    <span className="text-sm font-normal text-blue-600">{getLabel("tone", settings.tone)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.tone]}
                      onValueChange={(value) => handleSliderChange("tone", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Casual</span>
                      <span>Formal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Empathy Level
                    <span className="text-sm font-normal text-green-600">{getLabel("empathy", settings.empathy)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.empathy]}
                      onValueChange={(value) => handleSliderChange("empathy", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Direct</span>
                      <span>Supportive</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Directness
                    <span className="text-sm font-normal text-purple-600">
                      {getLabel("directness", settings.directness)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.directness]}
                      onValueChange={(value) => handleSliderChange("directness", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Gentle</span>
                      <span>Direct</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Creativity Factor
                    <span className="text-sm font-normal text-orange-600">
                      {getLabel("creativity", settings.creativity)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.creativity]}
                      onValueChange={(value) => handleSliderChange("creativity", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Traditional</span>
                      <span>Innovative</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Style</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="responseLength">Response Length</Label>
                    <Select
                      value={settings.responseLength}
                      onValueChange={(value) => handleInputChange("responseLength", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brief">Brief & Concise</SelectItem>
                        <SelectItem value="medium">Medium Detail</SelectItem>
                        <SelectItem value="detailed">Detailed & Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="feedbackStyle">Feedback Style</Label>
                    <Select
                      value={settings.feedbackStyle}
                      onValueChange={(value) => handleInputChange("feedbackStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="constructive">Constructive</SelectItem>
                        <SelectItem value="encouraging">Encouraging</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="useExamples">Use Real Examples</Label>
                    <Switch
                      id="useExamples"
                      checked={settings.useExamples}
                      onCheckedChange={(checked) => handleInputChange("useExamples", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="useMetaphors">Use Metaphors & Analogies</Label>
                    <Switch
                      id="useMetaphors"
                      checked={settings.useMetaphors}
                      onCheckedChange={(checked) => handleInputChange("useMetaphors", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeResources">Include Resources & Links</Label>
                    <Switch
                      id="includeResources"
                      checked={settings.includeResources}
                      onCheckedChange={(checked) => handleInputChange("includeResources", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackProgress">Track Progress</Label>
                    <Switch
                      id="trackProgress"
                      checked={settings.trackProgress}
                      onCheckedChange={(checked) => handleInputChange("trackProgress", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Analytical Depth
                    <span className="text-sm font-normal text-indigo-600">
                      {getLabel("analyticalDepth", settings.analyticalDepth)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.analyticalDepth]}
                      onValueChange={(value) => handleSliderChange("analyticalDepth", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Surface Level</span>
                      <span>Deep Analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meeting Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="meetingPreference">Preferred Meeting Style</Label>
                    <Select
                      value={settings.meetingPreference}
                      onValueChange={(value) => handleInputChange("meetingPreference", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="structured">Structured Sessions</SelectItem>
                        <SelectItem value="flexible">Flexible Conversations</SelectItem>
                        <SelectItem value="goal-focused">Goal-Focused</SelectItem>
                        <SelectItem value="exploratory">Exploratory Discussions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="communicationFrequency">Communication Frequency</Label>
                    <Select
                      value={settings.communicationFrequency}
                      onValueChange={(value) => handleInputChange("communicationFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Check-ins</SelectItem>
                        <SelectItem value="weekly">Weekly Sessions</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly Meetings</SelectItem>
                        <SelectItem value="monthly">Monthly Reviews</SelectItem>
                        <SelectItem value="as-needed">As Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals & Focus Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a goal..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addGoal(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addGoal(input.value)
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.goals.map((goal, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeGoal(goal)}
                      >
                        {goal} ×
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={settings.industryFocus}
                    onValueChange={(value) => handleInputChange("industryFocus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Business</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="creative">Creative Industries</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferred Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add preferred topic..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addTopic(e.currentTarget.value, "preferred")
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addTopic(input.value, "preferred")
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.preferredTopics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => removeTopic(topic, "preferred")}
                      >
                        {topic} ×
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Topics to Avoid</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add topic to avoid..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addTopic(e.currentTarget.value, "avoid")
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addTopic(input.value, "avoid")
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.avoidTopics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => removeTopic(topic, "avoid")}
                      >
                        {topic} ×
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Learning Style Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="learningStyle">Learning Style</Label>
                    <Select
                      value={settings.learningStyle}
                      onValueChange={(value) => handleInputChange("learningStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Visual Learner</SelectItem>
                        <SelectItem value="auditory">Auditory Learner</SelectItem>
                        <SelectItem value="kinesthetic">Hands-on Learner</SelectItem>
                        <SelectItem value="reading">Reading/Writing</SelectItem>
                        <SelectItem value="balanced">Balanced Approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="motivationalStyle">Motivational Style</Label>
                    <Select
                      value={settings.motivationalStyle}
                      onValueChange={(value) => handleInputChange("motivationalStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="encouraging">Encouraging</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                        <SelectItem value="supportive">Supportive</SelectItem>
                        <SelectItem value="results-focused">Results-Focused</SelectItem>
                        <SelectItem value="collaborative">Collaborative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Challenge Level
                    <span className="text-sm font-normal text-red-600">
                      {getLabel("challengeLevel", settings.challengeLevel)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.challengeLevel]}
                      onValueChange={(value) => handleSliderChange("challengeLevel", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Easy</span>
                      <span>Challenging</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      How much do you want to be pushed outside your comfort zone?
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Commitment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={settings.timeCommitment}
                    onValueChange={(value) => handleInputChange("timeCommitment", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light (1-2 hours/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 hours/week)</SelectItem>
                      <SelectItem value="intensive">Intensive (6-10 hours/week)</SelectItem>
                      <SelectItem value="immersive">Immersive (10+ hours/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personality Match</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={settings.personalityMatch}
                    onValueChange={(value) => handleInputChange("personalityMatch", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adaptive">Adaptive to My Style</SelectItem>
                      <SelectItem value="complementary">Complementary to My Weaknesses</SelectItem>
                      <SelectItem value="similar">Similar to My Personality</SelectItem>
                      <SelectItem value="challenging">Challenge My Thinking</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Fun Factor
                    <span className="text-sm font-normal text-green-600">{getLabel("fun", settings.fun)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.fun]}
                      onValueChange={(value) => handleSliderChange("fun", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Serious</span>
                      <span>Playful</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Practical Focus
                    <span className="text-sm font-normal text-orange-600">
                      {getLabel("practicality", settings.practicality)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.practicality]}
                      onValueChange={(value) => handleSliderChange("practicality", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Theoretical</span>
                      <span>Actionable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Approach Intensity
                    <span className="text-sm font-normal text-purple-600">
                      {getLabel("seriousness", settings.seriousness)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[settings.seriousness]}
                      onValueChange={(value) => handleSliderChange("seriousness", value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Light</span>
                      <span>Intense</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visual Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <img
                        src="/placeholder.svg?height=100&width=150"
                        alt="Professional setting"
                        className="w-full h-20 object-cover rounded-lg border-2 border-blue-500"
                      />
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg"></div>
                      <p className="text-xs text-center mt-1">Professional</p>
                    </div>
                    <div className="relative">
                      <img
                        src="/placeholder.svg?height=100&width=150"
                        alt="Casual setting"
                        className="w-full h-20 object-cover rounded-lg border-2 border-transparent hover:border-gray-300"
                      />
                      <p className="text-xs text-center mt-1">Casual</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Context Tab */}
          <TabsContent value="context" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Context & Preferences</CardTitle>
                <p className="text-sm text-gray-600">
                  Share any additional information that will help your mentor provide better guidance
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="context">Personal Context</Label>
                  <Textarea
                    id="context"
                    placeholder="Tell your mentor about your background, current situation, specific challenges, or anything else that would help them understand you better..."
                    value={settings.context}
                    onChange={(e) => handleInputChange("context", e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Role/Position</Label>
                    <Input placeholder="e.g., Software Engineer, Student, Entrepreneur" />
                  </div>
                  <div>
                    <Label>Experience Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (5-10 years)</SelectItem>
                        <SelectItem value="expert">Expert (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Biggest Challenges</Label>
                  <Textarea
                    placeholder="What are the main challenges you're facing right now?"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label>Success Metrics</Label>
                  <Textarea
                    placeholder="How do you define success? What metrics or outcomes are most important to you?"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mentor Inspiration</CardTitle>
                <p className="text-sm text-gray-600">Who are some mentors, leaders, or thinkers you admire?</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Steve Jobs", image: "/placeholder.svg?height=80&width=80", role: "Innovation" },
                    { name: "Warren Buffett", image: "/placeholder.svg?height=80&width=80", role: "Investing" },
                    { name: "Oprah Winfrey", image: "/placeholder.svg?height=80&width=80", role: "Leadership" },
                    { name: "Elon Musk", image: "/placeholder.svg?height=80&width=80", role: "Entrepreneurship" },
                  ].map((mentor, index) => (
                    <div key={index} className="text-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <img
                        src={mentor.image || "/placeholder.svg"}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                      />
                      <p className="text-sm font-medium">{mentor.name}</p>
                      <p className="text-xs text-gray-500">{mentor.role}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Personalized Mentor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Communication Style</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong>Tone:</strong> {getLabel("tone", settings.tone)}
                    </li>
                    <li>
                      • <strong>Empathy:</strong> {getLabel("empathy", settings.empathy)}
                    </li>
                    <li>
                      • <strong>Directness:</strong> {getLabel("directness", settings.directness)}
                    </li>
                    <li>
                      • <strong>Response Length:</strong> {settings.responseLength}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Learning Approach</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong>Style:</strong> {settings.learningStyle}
                    </li>
                    <li>
                      • <strong>Challenge Level:</strong> {getLabel("challengeLevel", settings.challengeLevel)}
                    </li>
                    <li>
                      • <strong>Time Commitment:</strong> {settings.timeCommitment}
                    </li>
                    <li>
                      • <strong>Focus:</strong> {settings.industryFocus}
                    </li>
                  </ul>
                </div>
              </div>
              {settings.goals.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Your Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {settings.goals.map((goal, index) => (
                      <Badge key={index} variant="outline">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
