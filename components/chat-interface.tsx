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
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="btn-text">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <img
                src={mentor.avatar || "/placeholder.svg"}
                alt={mentor.name}
                className="w-12 h-12 rounded-full object-cover shadow-md"
              />
              <div>
                <h1 className="text-h6 font-serif mentor-name">{mentor.name}</h1>
                <Badge variant="secondary" className="text-caption">
                  {mentor.field}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowFineTuning(true)} className="btn-text">
              <Settings className="w-4 h-4 mr-2" />
              Fine-tune
            </Button>
            <Button variant="outline" size="sm" onClick={onProfile} className="btn-text">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Mentor Info Panel */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <Brain className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <p className="text-body-sm font-medium text-blue-900">Mental Models:</p>
              <p className="text-body-sm text-blue-700">{mentor.mentalModels.join(" • ")}</p>
              <p className="text-caption text-blue-600 mt-1">Communication: {mentor.communicationStyle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="h-[calc(100vh-280px)] flex flex-col shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-h5 font-serif mentor-name">Mentorship Session</CardTitle>
              <div className="flex items-center gap-3 text-body-sm text-gray-500">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{mentor.rating}</span>
                <Badge variant="outline" className="ml-2 text-caption">
                  Live AI Connection
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-5 rounded-2xl ${
                      message.role === "user" 
                        ? "bg-purple-600 text-white" 
                        : "bg-gray-100 text-gray-900 shadow-sm"
                    }`}
                  >
                    <div
                      className={`${message.role === "assistant" ? "reading-content" : "text-body"} whitespace-pre-wrap`}
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
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
                      <span className="text-body-sm text-gray-500 font-serif">{mentor.name} is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <div className="border-t p-6 bg-gray-50">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Share your thoughts with ${mentor.name}...`}
                className="flex-1 text-body py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 rounded-xl btn-text"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-caption text-gray-500 mt-3 text-center">
              Powered by Lyzr AI • Real-time responses from {mentor.name}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}