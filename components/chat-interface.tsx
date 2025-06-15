"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Star, User, Brain, Settings } from "lucide-react"
import { useUserStore } from "@/lib/user-store"
import FineTuningPanel from "@/components/fine-tuning-panel"

interface ChatInterfaceProps {
  mentor: any
  onBack: () => void
  onProfile: () => void
}

// Function to format markdown-style text to HTML
const formatMessage = (text: string) => {
  // Replace **bold** with <strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Replace *italic* with <em>
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Replace line breaks
  formatted = formatted.replace(/\n/g, "<br>")

  // Replace numbered lists
  formatted = formatted.replace(/^(\d+)\.\s/gm, "<br><strong>$1.</strong> ")

  // Replace bullet points
  formatted = formatted.replace(/^[-•]\s/gm, "<br>• ")

  return formatted
}

export default function ChatInterface({ mentor, onBack, onProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm ${mentor.name}. ${mentor.description} I'm here to share insights based on my experience and perspective. What would you like to explore today?`,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showFineTuning, setShowFineTuning] = useState(false)
  const [fineTuningSettings, setFineTuningSettings] = useState({
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
    trackProgress: true
  })
  const { addSession } = useUserStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mentor: mentor,
          fineTuningSettings: fineTuningSettings,
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
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, aiMessage])

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
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === aiMessage.id ? { ...msg, content: aiResponse } : msg)),
                )
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      // Add session to user history
      addSession({
        mentorId: mentor.id,
        mentorName: mentor.name,
        sessionType: "Chat",
        date: new Date().toISOString(),
        duration: 15,
        rating: 5,
      })
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (showFineTuning) {
    return (
      <FineTuningPanel
        settings={fineTuningSettings}
        onSettingsChange={setFineTuningSettings}
        onBack={() => setShowFineTuning(false)}
      />
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
              <img
                src={mentor.avatar || "/placeholder.svg"}
                alt={mentor.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="font-semibold text-lg">{mentor.name}</h1>
                <Badge variant="secondary" className="text-xs">
                  {mentor.field}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFineTuning(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Fine-tune
            </Button>
            <Button variant="outline" size="sm" onClick={onProfile}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Mentor Info Panel */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <Brain className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm font-medium text-blue-900">Mental Models:</p>
              <p className="text-sm text-blue-700">{mentor.mentalModels.join(" • ")}</p>
              <p className="text-xs text-blue-600 mt-1">Communication: {mentor.communicationStyle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="h-[calc(100vh-280px)] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Mentorship Session</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{mentor.rating}</span>
                <Badge variant="outline" className="ml-2">
                  Live AI Connection
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{mentor.name} is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Share your thoughts with ${mentor.name}...`}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Lyzr AI • Real-time responses from {mentor.name}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
