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
      <div className="bg-white border-b border-gray-200 px-4 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="btn-text">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-h2 font-serif elegant-header">Choose Your Mentor</h1>
              {selectedInteraction && (
                <div className="flex items-center gap-2 text-body-sm text-gray-600 mt-2">
                  <InteractionIcon className="w-4 h-4" />
                  <span>for {getInteractionTitle()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search mentors, fields, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-body rounded-xl border-2 border-gray-200 focus:border-purple-400"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {fields.map((field) => (
                <Button
                  key={field}
                  variant={selectedField === field ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedField(field)}
                  className="btn-text rounded-lg"
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
        <div className="mb-6 text-body-sm text-gray-600">
          Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <img
                  src={mentor.avatar || "/placeholder.svg"}
                  alt={mentor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover group-hover:scale-105 transition-transform shadow-lg"
                />
                <CardTitle className="text-h5 font-serif mentor-name">{mentor.name}</CardTitle>
                <Badge variant="secondary" className="mt-3 text-caption">
                  {mentor.field}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-body text-gray-600 mb-6 leading-relaxed">{mentor.description}</p>

                {/* Mental Models */}
                <div className="mb-6">
                  <p className="text-caption font-medium text-gray-500 mb-2">Mental Models:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.mentalModels.slice(0, 3).map((model: string) => (
                      <Badge key={model} variant="outline" className="text-caption">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Communication Style */}
                <div className="mb-6">
                  <p className="text-caption font-medium text-gray-500 mb-2">Communication Style:</p>
                  <p className="text-caption text-gray-600 leading-relaxed">{mentor.communicationStyle}</p>
                </div>

                <div className="flex items-center justify-between mb-6 text-body-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mentor.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{mentor.sessions.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onMentorSelect(mentor)}
                  className="w-full group-hover:bg-purple-700 transition-colors btn-text-lg rounded-xl"
                >
                  {selectedInteraction ? `Start ${getInteractionTitle()}` : "Start Session"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-h5 font-serif mentor-name text-gray-600 mb-3">No mentors found</h3>
            <p className="text-body text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}