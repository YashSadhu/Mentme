"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Search, BookOpen, Clock, Users, Star } from "lucide-react"
import LearningPathDetail from "@/components/learning-path-detail"

interface LearningPathsProps {
  onBack: () => void
}

const learningPaths = [
  {
    id: "wealth-building",
    title: "Wealth Building Mastery",
    description:
      "Learn the fundamentals of building sustainable wealth through investing, entrepreneurship, and financial literacy",
    category: "Wealth",
    difficulty: "Beginner",
    duration: "8 weeks",
    modules: 12,
    completedModules: 3,
    participants: 15420,
    rating: 4.9,
    mentor: "Naval Ravikant",
    color: "bg-green-100 text-green-700",
    icon: "💰",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop",
    skills: ["Investing", "Entrepreneurship", "Financial Planning", "Passive Income"],
    overview: "Master the art of wealth creation through proven strategies and timeless principles.",
  },
  {
    id: "optimal-health",
    title: "Optimal Health & Longevity",
    description: "Comprehensive guide to physical and mental health optimization for peak performance",
    category: "Health",
    difficulty: "Intermediate",
    duration: "10 weeks",
    modules: 15,
    completedModules: 0,
    participants: 12890,
    rating: 4.8,
    mentor: "Andrew Huberman",
    color: "bg-blue-100 text-blue-700",
    icon: "🏃‍♂️",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
    skills: ["Nutrition", "Exercise", "Sleep", "Mental Health"],
    overview: "Optimize your body and mind for peak performance and longevity.",
  },
  {
    id: "ancient-wisdom",
    title: "Ancient Wisdom for Modern Life",
    description: "Timeless philosophical principles from Stoicism, Buddhism, and other wisdom traditions",
    category: "Wisdom",
    difficulty: "Advanced",
    duration: "12 weeks",
    modules: 18,
    completedModules: 7,
    participants: 8950,
    rating: 4.9,
    mentor: "Marcus Aurelius",
    color: "bg-purple-100 text-purple-700",
    icon: "🧠",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
    skills: ["Philosophy", "Critical Thinking", "Ethics", "Decision Making"],
    overview: "Apply ancient wisdom to navigate modern challenges with clarity and purpose.",
  },
  {
    id: "spiritual-awakening",
    title: "Spiritual Awakening Journey",
    description: "Explore consciousness, meditation, and spiritual practices for inner transformation",
    category: "Spirituality",
    difficulty: "Beginner",
    duration: "6 weeks",
    modules: 10,
    completedModules: 10,
    participants: 11200,
    rating: 4.8,
    mentor: "Swami Vivekananda",
    color: "bg-orange-100 text-orange-700",
    icon: "🕉️",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    skills: ["Meditation", "Mindfulness", "Self-Realization", "Inner Peace"],
    overview: "Discover your true nature and cultivate lasting inner peace and wisdom.",
  },
  {
    id: "creative-mastery",
    title: "Creative Mastery & Innovation",
    description: "Unlock your creative potential and learn to innovate like history's greatest minds",
    category: "Creativity",
    difficulty: "Intermediate",
    duration: "9 weeks",
    modules: 14,
    completedModules: 2,
    participants: 9750,
    rating: 4.7,
    mentor: "Leonardo da Vinci",
    color: "bg-pink-100 text-pink-700",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop",
    skills: ["Creative Thinking", "Innovation", "Problem Solving", "Artistic Expression"],
    overview: "Develop your creative abilities and learn to think like a Renaissance master.",
  },
  {
    id: "leadership-excellence",
    title: "Leadership Excellence",
    description: "Develop exceptional leadership skills through proven frameworks and real-world application",
    category: "Leadership",
    difficulty: "Advanced",
    duration: "11 weeks",
    modules: 16,
    completedModules: 0,
    participants: 7890,
    rating: 4.8,
    mentor: "Steve Jobs",
    color: "bg-indigo-100 text-indigo-700",
    icon: "👑",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=200&fit=crop",
    skills: ["Team Leadership", "Vision Setting", "Communication", "Strategic Thinking"],
    overview: "Master the art of leadership and inspire others to achieve extraordinary results.",
  },
]

const categories = ["All", "Wealth", "Health", "Wisdom", "Spirituality", "Creativity", "Leadership"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export default function LearningPaths({ onBack }: LearningPathsProps) {
  const [selectedPath, setSelectedPath] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const filteredPaths = learningPaths.filter((path) => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || path.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || path.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  if (selectedPath) {
    return <LearningPathDetail path={selectedPath} onBack={() => setSelectedPath(null)} />
  }

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
              <h1 className="text-2xl font-bold">Learning Paths</h1>
              <p className="text-gray-600">Structured journeys to master life's essential skills</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search learning paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredPaths.length} learning path{filteredPaths.length !== 1 ? "s" : ""}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <Card
              key={path.id}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => setSelectedPath(path)}
            >
              <div className="relative">
                <img
                  src={path.image || "/placeholder.svg"}
                  alt={path.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white">
                    {path.difficulty}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <div
                    className={`w-10 h-10 rounded-lg ${path.color} flex items-center justify-center text-xl bg-white bg-opacity-90`}
                  >
                    {path.icon}
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">{path.title}</CardTitle>
                <p className="text-sm text-gray-600">{path.description}</p>
              </CardHeader>

              <CardContent>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round((path.completedModules / path.modules) * 100)}%</span>
                  </div>
                  <Progress value={(path.completedModules / path.modules) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {path.completedModules} of {path.modules} modules completed
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Skills you'll learn:</p>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {path.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{path.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{path.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{path.rating}</span>
                  </div>
                </div>

                {/* Mentor */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">Mentor: </span>
                    <span className="font-medium">{path.mentor}</span>
                  </div>
                  <Button size="sm" className="group-hover:bg-purple-700 transition-colors">
                    {path.completedModules > 0 ? "Continue" : "Start Path"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No learning paths found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
