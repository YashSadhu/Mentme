"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Star, MessageCircle, Filter, Brain, Calendar, Target, PenTool } from "lucide-react"

interface MentorBrowserProps {
  mentors: any[]
  onMentorSelect: (mentor: any) => void
  onBack: () => void
  selectedInteraction?: string
}

const getInteractionIcon = (interaction: string) => {
  switch (interaction) {
    case "daily-checkin":
      return Calendar
    case "deep-dive":
      return Brain
    case "challenge-support":
      return Target
    case "journal-reflection":
      return PenTool
    default:
      return MessageCircle
  }
}

export default function MentorBrowser({ mentors, onMentorSelect, onBack, selectedInteraction }: MentorBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState("All")

  const fields = ["All", ...Array.from(new Set(mentors.map((mentor) => mentor.field)))]

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mentor.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesField = selectedField === "All" || mentor.field === selectedField
    return matchesSearch && matchesField
  })

  const getInteractionTitle = () => {
    switch (selectedInteraction) {
      case "daily-checkin":
        return "Daily Check-in"
      case "deep-dive":
        return "Deep Dive Session"
      case "challenge-support":
        return "Challenge Support"
      case "journal-reflection":
        return "Journal & Reflection"
      default:
        return "Chat Session"
    }
  }

  const InteractionIcon = getInteractionIcon(selectedInteraction || "chat")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Choose Your Mentor</h1>
              {selectedInteraction && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <InteractionIcon className="w-4 h-4" />
                  <span>for {getInteractionTitle()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search mentors, fields, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {fields.map((field) => (
                <Button
                  key={field}
                  variant={selectedField === field ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedField(field)}
                >
                  {field}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <img
                  src={mentor.avatar || "/placeholder.svg"}
                  alt={mentor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform"
                />
                <CardTitle className="text-xl">{mentor.name}</CardTitle>
                <Badge variant="secondary" className="mt-2">
                  {mentor.field}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">{mentor.description}</p>

                {/* Mental Models */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Mental Models:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.mentalModels.slice(0, 3).map((model: string) => (
                      <Badge key={model} variant="outline" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Communication Style */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Communication Style:</p>
                  <p className="text-xs text-gray-600">{mentor.communicationStyle}</p>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{mentor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{mentor.sessions.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onMentorSelect(mentor)}
                  className="w-full group-hover:bg-purple-700 transition-colors"
                >
                  {selectedInteraction ? `Start ${getInteractionTitle()}` : "Start Session"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No mentors found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
