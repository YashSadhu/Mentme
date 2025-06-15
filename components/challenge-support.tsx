"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Target, CheckCircle, Star, Clock, Lightbulb, Brain } from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface ChallengeSupportProps {
  mentor: any
  onBack: () => void
  onComplete: () => void
}

const challengeTypes = [
  "Career Transition",
  "Starting a Business",
  "Leadership Challenge",
  "Creative Block",
  "Financial Decision",
  "Relationship Issue",
  "Personal Habit",
  "Learning Goal",
  "Life Transition",
  "Decision Making",
  "Time Management",
  "Confidence Building",
]

// Function to format AI responses
const formatMessage = (text: string) => {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")
  formatted = formatted.replace(/\n/g, "<br>")
  formatted = formatted.replace(/^(\d+)\.\s/gm, "<br><strong>$1.</strong> ")
  formatted = formatted.replace(/^[-•]\s/gm, "<br>• ")
  return formatted
}

export default function ChallengeSupport({ mentor, onBack, onComplete }: ChallengeSupportProps) {
  const [challengeType, setChallengeType] = useState("")
  const [challengeDescription, setChallengeDescription] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [constraints, setConstraints] = useState("")
  const [actionPlan, setActionPlan] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { addSession } = useUserStore()

  const steps = [
    { title: "Define Challenge", description: "What specific challenge are you facing?" },
    { title: "Set Context", description: "Provide details and constraints" },
    { title: "Get Action Plan", description: "Receive a tailored strategy" },
  ]

  const handleNext = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1)
    } else {
      generateActionPlan()
    }
  }

  const generateActionPlan = async () => {
    setIsLoading(true)

    try {
      // Create a comprehensive prompt for challenge support
      const challengePrompt = `As ${mentor.name}, provide comprehensive challenge support for this situation:

**Challenge Type**: ${challengeType}
**Description**: ${challengeDescription}
**Timeframe**: ${timeframe}
**Constraints**: ${constraints}

Please provide a detailed action plan that includes:

**1. Challenge Analysis**: Your perspective on the root cause and nature of this challenge
**2. Strategic Approach**: Your recommended framework for tackling this challenge
**3. Immediate Action Steps**: 5-7 specific steps they can take in the next 24-48 hours
**4. Medium-term Strategy**: What to focus on over the next 2-4 weeks
**5. Potential Obstacles**: Likely challenges they'll face and how to overcome them
**6. Success Metrics**: How they'll know they're making progress
**7. Mental Model**: A key principle or mental model from your philosophy to guide them
**8. Encouragement**: Motivational message in your authentic voice

Make this practical, actionable, and tailored to their specific situation and constraints.`

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: challengePrompt }],
          mentor: mentor,
          fineTuningSettings: {
            tone: 50,
            fun: 30,
            seriousness: 75,
            practicality: 95,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      let aiResponse = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") break

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                aiResponse += content
                setActionPlan(aiResponse)
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      setIsComplete(true)

      // Add session to user history
      addSession({
        mentorId: mentor.id,
        mentorName: mentor.name,
        sessionType: "Challenge Support",
        date: new Date().toISOString(),
        duration: 30,
        rating: 5,
        notes: `Challenge: ${challengeType}`,
      })
    } catch (error) {
      console.error("Error generating action plan:", error)
      setActionPlan(`Here's my approach to your ${challengeType.toLowerCase()} challenge:

**Challenge Analysis**: ${challengeDescription ? `Your situation with "${challengeDescription}" requires a systematic approach.` : "This type of challenge requires breaking it down into manageable components."}

**Strategic Framework**:
1. **Clarify the Real Problem** - Often what we think is the problem isn't the root issue
2. **Assess Your Resources** - What strengths, skills, and support do you have?
3. **Create Small Wins** - Build momentum with achievable early victories
4. **Iterate and Adjust** - Be prepared to modify your approach based on results

**Immediate Actions** (Next 24-48 hours):
• Write down exactly what success looks like
• Identify the one biggest obstacle
• List 3 people who could provide advice or support
• Take one small action toward your goal
• Set up a simple tracking system for progress

**Medium-term Strategy** (2-4 weeks):
• ${timeframe ? `Given your ${timeframe} timeframe, focus on high-impact activities first` : "Focus on building sustainable habits and systems"}
• ${constraints ? `Work creatively within your constraints: ${constraints}` : "Leverage your unique advantages and resources"}

**Key Principle**: Progress over perfection. Every challenge is an opportunity to grow stronger and wiser.

Remember: You have more capability than you realize. Trust the process and take it one step at a time.`)
      setIsComplete(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Challenge Support Complete</h1>
            </div>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Action Plan Ready
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader className="text-center">
              <img
                src={mentor.avatar || "/placeholder.svg"}
                alt={mentor.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <CardTitle className="text-xl">Action Plan from {mentor.name}</CardTitle>
              <Badge variant="outline" className="mt-2">
                {challengeType}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Your Personalized Action Plan:</h3>
                </div>
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(actionPlan) }}
                />
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>30 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>Challenge support completed</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={onComplete} className="px-8">
                  Start Taking Action
                </Button>
                <Button variant="outline" onClick={() => setIsComplete(false)}>
                  Review Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold">Challenge Support</h1>
                <p className="text-gray-600">with {mentor.name}</p>
              </div>
            </div>
          </div>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? "bg-green-600 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${index < currentStep ? "bg-green-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium">{steps[currentStep].title}</p>
            <p className="text-xs text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <img
              src={mentor.avatar || "/placeholder.svg"}
              alt={mentor.name}
              className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
            />
            <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Type of Challenge</label>
                  <Select value={challengeType} onValueChange={setChallengeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="What type of challenge are you facing?" />
                    </SelectTrigger>
                    <SelectContent>
                      {challengeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Challenge Description</label>
                  <Textarea
                    value={challengeDescription}
                    onChange={(e) => setChallengeDescription(e.target.value)}
                    placeholder="Describe your specific challenge in detail..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Timeframe</label>
                  <Input
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="When do you need to resolve this? (e.g., 3 months, by end of year)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Constraints & Limitations</label>
                  <Textarea
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="What constraints are you working within? (budget, time, resources, etc.)"
                    rows={3}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && (!challengeType || !challengeDescription.trim())) ||
                  (currentStep === 1 && !timeframe.trim()) ||
                  isLoading
                }
                className="px-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 animate-pulse" />
                    Creating Action Plan...
                  </div>
                ) : currentStep === 1 ? (
                  "Get Action Plan"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
