"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  Users,
  Star,
  TrendingUp,
  Search,
  Zap,
  Brain,
  Target,
  Quote,
  Calendar,
  User,
  PenTool,
  BookOpen,
} from "lucide-react"
import UserProfile from "@/components/user-profile"
import MentorBrowser from "@/components/mentor-browser"
import ChatInterface from "@/components/chat-interface"
import DailyCheckin from "@/components/daily-checkin"
import DeepDive from "@/components/deep-dive"
import ChallengeSupport from "@/components/challenge-support"
import JournalReflection from "@/components/journal-reflection"
import { useUserStore } from "@/lib/user-store"
import LearningPaths from "@/components/learning-paths"
import DemoChat from "@/components/demo-chat"
import AIMentor from './components/AIMentor'
import QuarterlyReview from './components/QuarterlyReview'
import DailyTaskManager from '@/components/daily-task-manager'
import VisionReview from '@/components/vision-review'

const mentorPersonas = [
  {
    id: "naval-ravikant",
    name: "Naval Ravikant",
    field: "Entrepreneurship & Philosophy",
    avatar: "/placeholder.svg?height=80&width=80",
    description: "Angel investor and philosopher focused on wealth creation and happiness",
    rating: 4.9,
    sessions: 25420,
    expertise: ["Startups", "Investing", "Philosophy", "Decision Making"],
    quote: "Seek wealth, not money or status. Wealth is having assets that earn while you sleep.",
    personality: "Direct, philosophical, focuses on first principles thinking",
    communicationStyle: "Concise, tweet-like wisdom, uses analogies and frameworks",
    mentalModels: ["First principles", "Leverage", "Compound interest", "Optionality"],
    background: "Serial entrepreneur, AngelList founder, known for philosophical insights on wealth and happiness",
  },
  {
    id: "swami-vivekananda",
    name: "Swami Vivekananda",
    field: "Spirituality & Personal Development",
    avatar: "/placeholder.svg?height=80&width=80",
    description: "Spiritual teacher and philosopher who introduced Vedanta to the Western world",
    rating: 4.9,
    sessions: 18750,
    expertise: ["Spirituality", "Self-Realization", "Leadership", "Philosophy"],
    quote: "Arise, awake, and stop not until the goal is reached.",
    personality: "Inspiring, compassionate, deeply spiritual yet practical",
    communicationStyle: "Eloquent, uses metaphors, combines Eastern wisdom with practical advice",
    mentalModels: ["Self-realization", "Service to humanity", "Strength through adversity", "Unity in diversity"],
    background: "Hindu monk and spiritual leader who played a key role in introducing Vedanta and Yoga to the West",
  },
  {
    id: "steve-jobs",
    name: "Steve Jobs",
    field: "Innovation & Design",
    avatar: "/placeholder.svg?height=80&width=80",
    description: "Co-founder of Apple, master of product innovation and design thinking",
    rating: 4.8,
    sessions: 22890,
    expertise: ["Product Design", "Innovation", "Leadership", "Marketing"],
    quote: "Innovation distinguishes between a leader and a follower.",
    personality: "Perfectionist, visionary, demanding excellence, intuitive",
    communicationStyle: "Passionate, storytelling, focuses on simplicity and user experience",
    mentalModels: ["Simplicity", "User-centric design", "Think different", "Connecting the dots"],
    background: "Co-founder of Apple Inc., revolutionized personal computing, mobile phones, and digital publishing",
  },
  {
    id: "marcus-aurelius",
    name: "Marcus Aurelius",
    field: "Stoic Philosophy & Leadership",
    avatar: "/placeholder.svg?height=80&width=80",
    description: "Roman Emperor and Stoic philosopher, author of Meditations",
    rating: 4.9,
    sessions: 16200,
    expertise: ["Stoicism", "Leadership", "Self-Discipline", "Virtue Ethics"],
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    personality: "Reflective, disciplined, focused on virtue and duty",
    communicationStyle: "Contemplative, uses personal reflection, emphasizes virtue and reason",
    mentalModels: ["Stoic acceptance", "Virtue ethics", "Memento mori", "Present moment awareness"],
    background: "Roman Emperor (161-180 AD) and Stoic philosopher, known for his personal writings on Stoic philosophy",
  },
  {
    id: "marie-curie",
    name: "Marie Curie",
    field: "Science & Perseverance",
    avatar: "/placeholder.svg?height=80&width=80",
    description: "Nobel Prize winner in Physics and Chemistry, pioneer in radioactivity research",
    rating: 4.8,
    sessions: 14950,
    expertise: ["Scientific Research", "Perseverance", "Breaking Barriers", "Innovation"],
    quote: "Nothing in life is to be feared, it is only to be understood.",
    personality: "Determined, curious, methodical, resilient in face of adversity",
    communicationStyle: "Precise, evidence-based, encouraging persistence and curiosity",
    mentalModels: [
      "Scientific method",
      "Persistence through adversity",
      "Curiosity-driven learning",
      "Breaking barriers",
    ],
    background: "First woman to win a Nobel Prize, first person to win Nobel Prizes in two different sciences",
  },
  {
    id: "leonardo-da-vinci",
    name: "Leonardo da Vinci",
    field: "Renaissance Thinking & Creativity",
    avatar: "/placeholder.svg?height=80&width=80",
    description: "Renaissance polymath, artist, inventor, and scientist",
    rating: 4.9,
    sessions: 19300,
    expertise: ["Creativity", "Art", "Innovation", "Interdisciplinary Thinking"],
    quote: "Learning never exhausts the mind.",
    personality: "Endlessly curious, creative, observant, interdisciplinary thinker",
    communicationStyle: "Visual, metaphorical, connects disparate ideas, encourages observation",
    mentalModels: ["Curiosity", "Observation", "Interdisciplinary thinking", "Learning from nature"],
    background: "Italian Renaissance polymath known for art, science, engineering, and numerous inventions",
  },
]

const interactionTypes = [
  {
    id: "daily-checkin",
    name: "Daily Check-in",
    description: "5-10 minute sessions for daily guidance and motivation",
    icon: Calendar,
    duration: "5-10 min",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    description: "30-60 minute comprehensive guidance sessions",
    icon: Brain,
    duration: "30-60 min",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "challenge-support",
    name: "Challenge Support",
    description: "Tailored assistance for specific challenges",
    icon: Target,
    duration: "15-45 min",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "journal-reflection",
    name: "Journal & Reflection",
    description: "Document thoughts and receive mentor feedback",
    icon: PenTool,
    duration: "Flexible",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "learning-paths",
    name: "Learning Paths",
    description: "Structured journeys to master essential life skills",
    icon: BookOpen,
    duration: "6-12 weeks",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "demo-chat",
    name: "Try Demo",
    description: "Experience the platform with an interactive demo",
    icon: Zap,
    duration: "5-15 min",
    color: "bg-yellow-100 text-yellow-700",
  },
]

export default function Home() {
  const [currentView, setCurrentView] = useState<string>("landing")
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [selectedInteraction, setSelectedInteraction] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useUserStore()
  const [showVisionReview, setShowVisionReview] = useState(false)
  const [showMentorDashboard, setShowMentorDashboard] = useState(false)

  // Fix hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMentorSelect = (mentor: any, interactionType = "chat") => {
    setSelectedMentor(mentor)
    setSelectedInteraction(interactionType)
    setCurrentView(interactionType)
  }

  const handleInteractionSelect = (interactionType: string) => {
    setSelectedInteraction(interactionType)
    if (interactionType === "learning-paths") {
      setCurrentView("learning-paths")
    } else if (interactionType === "demo-chat") {
      setCurrentView("demo-chat")
    } else if (selectedMentor) {
      setCurrentView(interactionType)
    } else {
      setCurrentView("mentor-browser")
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Loading Timeless Mentors...</h1>
        </div>
      </div>
    )
  }

  // Route to different components based on current view
  if (currentView === "profile") {
    return <UserProfile onBack={() => setCurrentView("landing")} />
  }

  if (currentView === "mentor-browser") {
    return (
      <MentorBrowser
        mentors={mentorPersonas}
        onMentorSelect={(mentor) => handleMentorSelect(mentor, selectedInteraction || "chat")}
        onBack={() => setCurrentView("landing")}
        selectedInteraction={selectedInteraction}
      />
    )
  }

  if (currentView === "chat") {
    return (
      <ChatInterface
        mentor={selectedMentor}
        onBack={() => setCurrentView("landing")}
        onProfile={() => setCurrentView("profile")}
      />
    )
  }

  if (currentView === "daily-checkin") {
    return (
      <DailyCheckin
        mentor={selectedMentor}
        onBack={() => setCurrentView("landing")}
        onComplete={() => setCurrentView("landing")}
      />
    )
  }

  if (currentView === "deep-dive") {
    return (
      <DeepDive
        mentor={selectedMentor}
        onBack={() => setCurrentView("landing")}
        onComplete={() => setCurrentView("landing")}
      />
    )
  }

  if (currentView === "challenge-support") {
    return (
      <ChallengeSupport
        mentor={selectedMentor}
        onBack={() => setCurrentView("landing")}
        onComplete={() => setCurrentView("landing")}
      />
    )
  }

  if (currentView === "journal-reflection") {
    return (
      <JournalReflection
        mentor={selectedMentor}
        onBack={() => setCurrentView("landing")}
        onMentorSelect={(mentor) => setSelectedMentor(mentor)}
      />
    )
  }

  if (currentView === "learning-paths") {
    return <LearningPaths onBack={() => setCurrentView("landing")} />
  }

  if (currentView === "demo-chat") {
    return <DemoChat onBack={() => setCurrentView("landing")} />
  }

  if (showMentorDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mentor Dashboard</h1>
              <p className="text-gray-600">Your personalized growth and learning journey</p>
            </div>
            <Button variant="outline" onClick={() => setShowMentorDashboard(false)}>
              Back to Home
            </Button>
          </div>
          <DailyTaskManager />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Timeless Mentors</h1>
              <p className="text-gray-600">Learn from history's greatest minds</p>
            </div>
          </div>
          {isAuthenticated && (
            <Button variant="outline" onClick={() => setCurrentView("profile")}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          )}
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Wisdom from History's Greatest Minds
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal <span className="text-purple-600">Mentorship</span> Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with AI mentors fine-tuned on the wisdom of Naval Ravikant, Swami Vivekananda, Steve Jobs, and other
            legendary figures. Get personalized guidance tailored to your unique challenges and goals.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search mentors or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* AI Mentor Dashboard Card */}
        <div className="mb-16">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setShowMentorDashboard(true)}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">AI Mentor Dashboard</CardTitle>
                  <p className="text-gray-600">Track your progress, set goals, and get personalized guidance</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Daily Tasks</h4>
                  <p className="text-sm text-purple-700">Personalized learning tasks and reflections</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Vision Review</h4>
                  <p className="text-sm text-blue-700">Quarterly planning and progress tracking</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">AI Insights</h4>
                  <p className="text-sm text-green-700">Personalized recommendations and patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interaction Types */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose Your Mentorship Style</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interactionTypes.map((type) => (
              <Card
                key={type.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleInteractionSelect(type.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-lg ${type.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <type.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{type.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {type.duration}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Mentors */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="text-3xl font-bold text-gray-900">Featured Mentors</h3>
            </div>
            <Button variant="outline" onClick={() => setCurrentView("mentor-browser")}>
              View All Mentors
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorPersonas.slice(0, 6).map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <img
                    src={mentor.avatar || "/placeholder.svg"}
                    alt={mentor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform"
                  />
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {mentor.field}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Quote className="w-4 h-4 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 italic">"{mentor.quote}"</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {mentor.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
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
                    onClick={() => handleMentorSelect(mentor, "chat")}
                    className="w-full group-hover:bg-purple-700 transition-colors"
                  >
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Personal Profiles</h4>
              <p className="text-sm text-gray-600">Track progress and mentorship history</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Fine-tuned AI</h4>
              <p className="text-sm text-gray-600">Models trained on mentor-specific content</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Diverse Interactions</h4>
              <p className="text-sm text-gray-600">Multiple session types for different needs</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Journal & Reflect</h4>
              <p className="text-sm text-gray-600">Document insights and get feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-12">
          <h3 className="text-4xl font-bold mb-4">Begin Your Mentorship Journey</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands learning from AI mentors trained on the wisdom of history's greatest minds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4"
              onClick={() => handleInteractionSelect("demo-chat")}
            >
              <Zap className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600"
              onClick={() => setCurrentView("mentor-browser")}
            >
              <Users className="w-5 h-5 mr-2" />
              Choose Your Mentor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
