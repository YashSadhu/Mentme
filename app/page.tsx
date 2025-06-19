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

const mentorPersonas = [
  {
    id: "naval-ravikant",
    name: "Naval Ravikant",
    field: "Entrepreneurship & Philosophy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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
    avatar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=face",
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
    avatar: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=150&h=150&fit=crop&crop=face",
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
    avatar: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150&h=150&fit=crop&crop=face",
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
    avatar: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=150&h=150&fit=crop&crop=face",
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
    avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face",
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

export default function HomePage() {
  const [currentView, setCurrentView] = useState<string>("landing")
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [selectedInteraction, setSelectedInteraction] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useUserStore()

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
          <h1 className="text-h4 font-serif text-gray-900">Loading Timeless Mentors...</h1>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-h2 font-serif elegant-header text-gray-900">Timeless Mentors</h1>
              <p className="text-body text-gray-600">Learn from history's greatest minds</p>
            </div>
          </div>
          {isAuthenticated && (
            <Button variant="outline" onClick={() => setCurrentView("profile")} className="btn-text">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          )}
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-6 py-3 rounded-full text-body-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            AI-Powered Wisdom from History's Greatest Minds
          </div>
          <h2 className="text-hero font-serif elegant-header text-gray-900 mb-8 leading-tight">
            Your Personal <span className="text-purple-600">Mentorship</span> Journey
          </h2>
          <p className="text-body-lg text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
            Connect with AI mentors fine-tuned on the wisdom of Naval Ravikant, Swami Vivekananda, Steve Jobs, and other
            legendary figures. Get personalized guidance tailored to your unique challenges and goals.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative mb-10">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search mentors or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-body rounded-xl border-2 border-gray-200 focus:border-purple-400 shadow-sm"
            />
          </div>
        </div>

        {/* Interaction Types */}
        <div className="mb-20">
          <h3 className="text-h2 font-serif elegant-header text-gray-900 mb-10 text-center">Choose Your Mentorship Style</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interactionTypes.map((type) => (
              <Card
                key={type.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md"
                onClick={() => handleInteractionSelect(type.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-20 h-20 rounded-xl ${type.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm`}
                  >
                    <type.icon className="w-9 h-9" />
                  </div>
                  <CardTitle className="text-h5 font-serif mentor-name">{type.name}</CardTitle>
                  <Badge variant="outline" className="mt-3 text-caption font-medium">
                    {type.duration}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-body text-gray-600 text-center leading-relaxed">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Mentors */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-purple-600" />
              <h3 className="text-h2 font-serif elegant-header text-gray-900">Featured Mentors</h3>
            </div>
            <Button variant="outline" onClick={() => setCurrentView("mentor-browser")} className="btn-text">
              View All Mentors
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorPersonas.slice(0, 6).map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
                <CardHeader className="text-center pb-6">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full mx-auto mb-6 object-cover group-hover:scale-105 transition-transform shadow-lg"
                  />
                  <CardTitle className="text-h5 font-serif mentor-name">{mentor.name}</CardTitle>
                  <Badge variant="secondary" className="mt-3 text-caption">
                    {mentor.field}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-6">
                    <Quote className="w-5 h-5 text-gray-400 mb-3" />
                    <p className="quote-text text-gray-700">"{mentor.quote}"</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {mentor.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-caption">
                        {skill}
                      </Badge>
                    ))}
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
                    onClick={() => handleMentorSelect(mentor, "chat")}
                    className="w-full group-hover:bg-purple-700 transition-colors btn-text-lg"
                  >
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-h6 font-serif mentor-name mb-3">Personal Profiles</h4>
              <p className="text-body-sm text-gray-600 leading-relaxed">Track progress and mentorship history</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-h6 font-serif mentor-name mb-3">Fine-tuned AI</h4>
              <p className="text-body-sm text-gray-600 leading-relaxed">Models trained on mentor-specific content</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-h6 font-serif mentor-name mb-3">Diverse Interactions</h4>
              <p className="text-body-sm text-gray-600 leading-relaxed">Multiple session types for different needs</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-h6 font-serif mentor-name mb-3">Journal & Reflect</h4>
              <p className="text-body-sm text-gray-600 leading-relaxed">Document insights and get feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-3xl p-16 shadow-2xl">
          <h3 className="text-h1 font-serif elegant-header mb-6">Begin Your Mentorship Journey</h3>
          <p className="text-body-lg mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands learning from AI mentors trained on the wisdom of history's greatest minds
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-body-lg px-10 py-4 rounded-xl"
              onClick={() => handleInteractionSelect("demo-chat")}
            >
              <Zap className="w-5 h-5 mr-3" />
              Try Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-body-lg px-10 py-4 border-white text-white hover:bg-white hover:text-purple-600 rounded-xl"
              onClick={() => setCurrentView("mentor-browser")}
            >
              <Users className="w-5 h-5 mr-3" />
              Choose Your Mentor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}