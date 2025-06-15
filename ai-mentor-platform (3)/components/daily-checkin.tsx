"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, CheckCircle, Star, Clock, Brain } from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface DailyCheckinProps {
  mentor: any
  onBack: () => void
  onComplete: () => void
}

const checkinQuestions = [
  "How are you feeling today?",
  "What's your main focus for today?",
  "What challenge are you currently facing?",
  "What would success look like today?",
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

export default function DailyCheckin({ mentor, onBack, onComplete }: DailyCheckinProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>(["", "", "", ""])
  const [mentorAdvice, setMentorAdvice] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addSession } = useUserStore()

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses]
    newResponses[currentQuestion] = value
    setResponses(newResponses)
  }

  const handleNext = () => {
    if (currentQuestion < checkinQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      generateMentorAdvice()
    }
  }

  const generateMentorAdvice = async () => {
    setIsLoading(true)

    try {
      // Create a comprehensive prompt for the AI
      const checkinPrompt = `As ${mentor.name}, provide personalized daily guidance based on these check-in responses:

1. How are you feeling today? "${responses[0]}"
2. What's your main focus for today? "${responses[1]}"
3. What challenge are you currently facing? "${responses[2]}"
4. What would success look like today? "${responses[3]}"

Please provide:
- **Personalized insights** based on their responses
- **3 specific actionable recommendations** for today
- **One key mental model or principle** from your philosophy to guide them
- **An encouraging message** in your authentic voice

Keep the response focused, practical, and inspiring - suitable for a daily check-in session.`

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: checkinPrompt }],
          mentor: mentor,
          fineTuningSettings: {
            tone: 60,
            fun: 40,
            seriousness: 70,
            practicality: 90,
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
                setMentorAdvice(aiResponse)
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
        sessionType: "Daily Check-in",
        date: new Date().toISOString(),
        duration: 8,
        rating: 5,
      })
    } catch (error) {
      console.error("Error generating advice:", error)
      setMentorAdvice(`I appreciate you sharing your thoughts with me today. Based on what you've told me, here's my guidance:

**Key Insight**: Every day is an opportunity to move closer to your goals, no matter how you're feeling.

**Today's Recommendations**:
1. **Focus on your priority** - ${responses[1] ? `Your focus on "${responses[1]}" is important. Break it into smaller, manageable steps.` : "Identify one key task that will move you forward."}
2. **Address your challenge** - ${responses[2] ? `Regarding "${responses[2]}", remember that obstacles are opportunities in disguise.` : "Face challenges with curiosity rather than resistance."}
3. **Define success clearly** - ${responses[3] ? `Your vision of success today: "${responses[3]}" - keep this in mind as you make decisions.` : "Set a clear, achievable goal for today."}

Remember: Progress, not perfection, is the goal. You have the power to make today meaningful.`)
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
              <h1 className="text-2xl font-bold">Daily Check-in Complete</h1>
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
              <CardTitle className="text-xl">Wisdom from {mentor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(mentorAdvice) }}
                />
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>8 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>Session completed</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={onComplete} className="px-8">
                  Continue Your Day
                </Button>
                <Button variant="outline" onClick={() => setIsComplete(false)}>
                  Review Responses
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
              <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Daily Check-in</h1>
                <p className="text-gray-600">with {mentor.name}</p>
              </div>
            </div>
          </div>
          <Badge variant="outline">
            {currentQuestion + 1} of {checkinQuestions.length}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / checkinQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <img
              src={mentor.avatar || "/placeholder.svg"}
              alt={mentor.name}
              className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
            />
            <CardTitle className="text-xl">{checkinQuestions[currentQuestion]}</CardTitle>
            <p className="text-gray-600 mt-2">Take a moment to reflect and share your thoughts</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Textarea
                value={responses[currentQuestion]}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder="Share your thoughts here..."
                rows={4}
                className="w-full"
              />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!responses[currentQuestion].trim() || isLoading}
                  className="px-8"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 animate-pulse" />
                      Getting Guidance...
                    </div>
                  ) : currentQuestion === checkinQuestions.length - 1 ? (
                    "Get Guidance"
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
