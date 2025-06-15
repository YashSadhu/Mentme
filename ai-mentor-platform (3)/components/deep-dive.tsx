"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Brain, CheckCircle, Star, Clock } from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface DeepDiveProps {
  mentor: any
  onBack: () => void
  onComplete: () => void
}

const deepDiveTopics = [
  "Life Purpose & Direction",
  "Career Transition",
  "Building Wealth",
  "Leadership Development",
  "Creative Breakthrough",
  "Overcoming Fear",
  "Decision Making",
  "Personal Growth",
  "Relationship Challenges",
  "Health & Wellness",
]

// Function to format AI responses
const formatMessage = (text: string) => {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
  formatted = formatted.replace(/\n/g, "<br>")
  formatted = formatted.replace(/^(\d+)\.\s/gm, "<br><strong>$1.</strong> ")
  formatted = formatted.replace(/^[-•]\s/gm, "<br>• ")
  // Handle ### headers
  formatted = formatted.replace(/^### (.*$)/gm, "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>")
  formatted = formatted.replace(/^## (.*$)/gm, "<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>")
  formatted = formatted.replace(/^# (.*$)/gm, "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>")
  return formatted
}

export default function DeepDive({ mentor, onBack, onComplete }: DeepDiveProps) {
  const [selectedTopic, setSelectedTopic] = useState("")
  const [context, setContext] = useState("")
  const [specificQuestion, setSpecificQuestion] = useState("")
  const [mentorGuidance, setMentorGuidance] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { addSession } = useUserStore()

  const steps = [
    { title: "Choose Topic", description: "Select the area you want to explore" },
    { title: "Provide Context", description: "Share your current situation" },
    { title: "Ask Your Question", description: "What specific guidance do you need?" },
    { title: "Receive Guidance", description: "Get deep insights from your mentor" },
  ]

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      generateDeepGuidance()
    }
  }

  const generateDeepGuidance = async () => {
    setIsLoading(true)

    try {
      // Create a comprehensive prompt for deep dive guidance
      const deepDivePrompt = `As ${mentor.name}, provide comprehensive guidance for this deep dive session:

**Topic**: ${selectedTopic}
**Context**: ${context}
**Specific Question**: ${specificQuestion}

Please provide a thorough response that includes:

**1. Deep Analysis**: Your perspective on their situation based on your expertise and philosophy
**2. Strategic Framework**: A clear framework or mental model to approach this challenge
**3. Actionable Steps**: 5-7 specific, practical steps they can take immediately
**4. Potential Obstacles**: What challenges they might face and how to overcome them
**5. Long-term Vision**: How this connects to their broader life goals
**6. Key Principle**: One core principle from your philosophy that applies here

Make this a comprehensive, transformative guidance session that reflects your unique wisdom and approach. Be specific, practical, and inspiring.`

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: deepDivePrompt }],
          mentor: mentor,
          fineTuningSettings: {
            tone: 40,
            fun: 20,
            seriousness: 80,
            practicality: 85,
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
                setMentorGuidance(aiResponse)
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
        sessionType: "Deep Dive",
        date: new Date().toISOString(),
        duration: 45,
        rating: 5,
        notes: `Topic: ${selectedTopic}`,
      })
    } catch (error) {
      console.error("Error generating guidance:", error)
      setMentorGuidance(`Thank you for bringing this important question about ${selectedTopic} to me.

**My Analysis**: ${context ? `Based on your situation with ${context}, I see this as an opportunity for significant growth.` : "This is a fundamental area that requires deep reflection and strategic action."}

**Framework for Success**:
1. **Clarity First** - Define exactly what success looks like in this area
2. **Current State Assessment** - Honestly evaluate where you are now
3. **Gap Analysis** - Identify what needs to change
4. **Strategic Action** - Create a step-by-step plan
5. **Consistent Execution** - Take daily action toward your goal

**Immediate Steps**:
• Spend 30 minutes today writing down your thoughts on this topic
• Identify the one biggest obstacle you're facing
• Research others who have succeeded in this area
• Create a simple daily practice related to your goal
• Find an accountability partner or mentor

**Key Principle**: The path becomes clear as you walk it. Start with what you know, and the next steps will reveal themselves through action.

Remember: Transformation happens through consistent small actions, not dramatic gestures.`)
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
              <h1 className="text-2xl font-bold">Deep Dive Complete</h1>
            </div>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
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
              <CardTitle className="text-xl">Deep Guidance from {mentor.name}</CardTitle>
              <Badge variant="outline" className="mt-2">
                {selectedTopic}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold mb-3">Your Question:</h3>
                <p className="text-gray-700 mb-4">{specificQuestion}</p>
                <h3 className="font-semibold mb-3">Comprehensive Guidance:</h3>
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(mentorGuidance) }}
                />
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>45 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>Deep dive completed</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={onComplete} className="px-8">
                  Apply This Guidance
                </Button>
                <Button variant="outline" onClick={() => setIsComplete(false)}>
                  Review Session
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
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold">Deep Dive Session</h1>
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
                    index <= currentStep ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${index < currentStep ? "bg-purple-600" : "bg-gray-200"}`} />
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
              <div className="space-y-4">
                <p className="text-gray-600 text-center mb-6">What area would you like to explore deeply?</p>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a topic for deep exploration" />
                  </SelectTrigger>
                  <SelectContent>
                    {deepDiveTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 text-center mb-6">
                  Share your current situation regarding <strong>{selectedTopic}</strong>
                </p>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Describe your current situation, challenges, and what you've tried so far..."
                  rows={6}
                  className="w-full"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600 text-center mb-6">What specific guidance do you need from {mentor.name}?</p>
                <Textarea
                  value={specificQuestion}
                  onChange={(e) => setSpecificQuestion(e.target.value)}
                  placeholder="Ask your specific question or describe what kind of guidance you're seeking..."
                  rows={4}
                  className="w-full"
                />
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
                  (currentStep === 0 && !selectedTopic) ||
                  (currentStep === 1 && !context.trim()) ||
                  (currentStep === 2 && !specificQuestion.trim()) ||
                  isLoading
                }
                className="px-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 animate-pulse" />
                    Generating Deep Guidance...
                  </div>
                ) : currentStep === 2 ? (
                  "Get Deep Guidance"
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
