"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Star, Sparkles } from "lucide-react"

interface DemoChatProps {
  onBack: () => void
}

const demoMentor = {
  name: "Demo Mentor",
  field: "General Guidance",
  avatar: "/placeholder.svg?height=80&width=80",
  description: "Experience our AI mentorship platform with this interactive demo",
  rating: 4.9,
}

// Function to format AI responses
const formatMessage = (text: string) => {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")
  formatted = formatted.replace(/\n/g, "<br>")
  formatted = formatted.replace(/^(\d+)\.\s/gm, "<br><strong>$1.</strong> ")
  formatted = formatted.replace(/^[-•]\s/gm, "<br>• ")
  return formatted
}

export default function DemoChat({ onBack }: DemoChatProps) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to the AI Mentor Platform demo! I'm here to show you how our mentorship system works. Ask me anything about personal growth, career advice, or life guidance. Try asking something like 'How can I build better habits?' or 'What's the key to success?'",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      // Use the same API for demo but with a demo mentor context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mentor: {
            name: "Demo AI Assistant",
            field: "Platform Demo & Life Guidance",
            description:
              "AI assistant demonstrating the Timeless Mentors platform capabilities while providing helpful life guidance",
            background:
              "Designed to showcase the platform features and help users understand how AI mentorship works, while also providing genuine wisdom and practical advice for personal growth",
            mentalModels: [
              "User Experience",
              "Platform Features",
              "AI Capabilities",
              "Personal Growth",
              "Practical Wisdom",
            ],
            communicationStyle:
              "Friendly, informative, and helpful in explaining platform features while providing genuine mentorship",
          },
          fineTuningSettings: {
            tone: 60,
            fun: 70,
            seriousness: 40,
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
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. This demo shows how our AI mentors would respond to your questions with personalized guidance. In the full platform, you'd get real-time responses from mentors like Naval Ravikant, Steve Jobs, and other legendary figures!",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">{demoMentor.name}</h1>
                <Badge variant="secondary" className="text-xs">
                  Interactive Demo
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{demoMentor.rating}</span>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-700 text-sm">
            🎯 <strong>Live Demo:</strong> This demo uses real AI responses to showcase our platform features and
            capabilities. Try asking about habits, success, or personal growth!
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="h-[calc(100vh-250px)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Demo Mentoring Session</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
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
                    <div className="flex items-ms-center gap-2">
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
                      <span className="text-sm text-gray-500">Demo mentor is thinking...</span>
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
                placeholder="Try asking: 'How can I build better habits?' or 'What's the key to success?'"
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Lyzr AI • Real-time responses demonstrating our mentorship platform
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
