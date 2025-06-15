"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, PenTool, Plus, MessageCircle, Calendar, Tag, Search } from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface JournalReflectionProps {
  mentor?: any
  onBack: () => void
  onMentorSelect: (mentor: any) => void
}

const journalPrompts = [
  "What did I learn today?",
  "What am I grateful for?",
  "What challenged me today?",
  "What would I do differently?",
  "What progress did I make toward my goals?",
  "What insights did I gain?",
  "How did I grow today?",
  "What patterns am I noticing?",
]

const availableMentors = [
  { id: "naval-ravikant", name: "Naval Ravikant" },
  { id: "swami-vivekananda", name: "Swami Vivekananda" },
  { id: "steve-jobs", name: "Steve Jobs" },
  { id: "marcus-aurelius", name: "Marcus Aurelius" },
  { id: "marie-curie", name: "Marie Curie" },
  { id: "leonardo-da-vinci", name: "Leonardo da Vinci" },
]

export default function JournalReflection({ mentor, onBack, onMentorSelect }: JournalReflectionProps) {
  const [currentView, setCurrentView] = useState<"list" | "write" | "read">("list")
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    mentorId: mentor?.id || "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("All")
  const { user, addJournalEntry, updateJournalEntry } = useUserStore()

  const journalEntries = user?.journalEntries || []
  const allTags = ["All", ...Array.from(new Set(journalEntries.flatMap((entry) => entry.tags)))]

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "All" || entry.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: newEntry.title,
      content: newEntry.content,
      tags: newEntry.tags,
      mentorId: newEntry.mentorId,
    }

    addJournalEntry(entry)

    // Generate mentor feedback if mentor is selected
    if (newEntry.mentorId) {
      setTimeout(() => {
        const feedback = generateMentorFeedback(newEntry.content, newEntry.mentorId)
        updateJournalEntry(entry.id, { mentorFeedback: feedback })
      }, 1000)
    }

    setNewEntry({ title: "", content: "", tags: [], mentorId: mentor?.id || "" })
    setCurrentView("list")
  }

  const generateMentorFeedback = (content: string, mentorId: string): string => {
    const feedbackMap = {
      "naval-ravikant":
        "I appreciate your reflection. Remember, self-awareness is the beginning of wisdom. Focus on what you can control and build systems that compound over time. What specific knowledge can you extract from this experience?",
      "swami-vivekananda":
        "Your introspection shows spiritual growth. Each challenge is an opportunity to strengthen your character. Remember, you have infinite potential within you. How can you use this insight to serve others better?",
      "steve-jobs":
        "Great reflection. The key is connecting these experiences to create something meaningful. How can you apply this learning to build something that matters? Stay hungry for knowledge and foolish enough to take risks.",
      "marcus-aurelius":
        "Your self-examination is commendable. Remember, we suffer more in imagination than reality. Focus on virtue and what is within your control. How can you use this wisdom to become a better person?",
      "marie-curie":
        "I admire your curiosity and persistence. Every observation is data that can lead to discovery. What hypotheses can you form from this experience? Keep questioning and experimenting.",
      "leonardo-da-vinci":
        "Your observations show the mind of a learner. Connect this experience to other areas of your life. What patterns do you see? How can you apply this knowledge creatively?",
    }

    return (
      feedbackMap[mentorId as keyof typeof feedbackMap] ||
      "Thank you for sharing your thoughts. Reflection is the path to wisdom. What action will you take based on this insight?"
    )
  }

  if (currentView === "write") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("list")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
              <h1 className="text-2xl font-bold">New Journal Entry</h1>
            </div>
            <Button onClick={handleSaveEntry} disabled={!newEntry.title.trim() || !newEntry.content.trim()}>
              Save Entry
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="Entry title..."
                  className="text-lg font-medium"
                />

                <div className="flex gap-4">
                  <Select
                    value={newEntry.mentorId}
                    onValueChange={(value) => setNewEntry({ ...newEntry, mentorId: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Choose mentor for feedback" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No mentor feedback</SelectItem>
                      {availableMentors.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Add tags (comma separated)"
                    value={newEntry.tags.join(", ")}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Reflection prompts to get you started:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {journalPrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewEntry({
                            ...newEntry,
                            content: newEntry.content + (newEntry.content ? "\n\n" : "") + prompt + "\n",
                          })
                        }
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>

                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Write your thoughts, reflections, and insights..."
                  rows={12}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "read" && selectedEntry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("list")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
              <h1 className="text-2xl font-bold">{selectedEntry.title}</h1>
            </div>
            <Badge variant="outline">{new Date(selectedEntry.date).toLocaleDateString()}</Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedEntry.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedEntry.date).toLocaleDateString()}</span>
                  </div>
                  {selectedEntry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedEntry.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                      {selectedEntry.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {selectedEntry.mentorFeedback && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageCircle className="w-5 h-5" />
                      Mentor Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-800 leading-relaxed">{selectedEntry.mentorFeedback}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <PenTool className="w-6 h-6 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold">Journal & Reflection</h1>
                <p className="text-gray-600">Document your thoughts and insights</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setCurrentView("write")}>
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="max-w-6xl mx-auto p-6">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {journalEntries.length === 0 ? "Start Your Journal" : "No entries found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {journalEntries.length === 0
                ? "Begin documenting your thoughts, insights, and reflections"
                : "Try adjusting your search or filter criteria"}
            </p>
            <Button onClick={() => setCurrentView("write")}>
              <Plus className="w-4 h-4 mr-2" />
              Write Your First Entry
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedEntry(entry)
                  setCurrentView("read")
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{entry.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">{entry.content}</p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  {entry.mentorFeedback && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <MessageCircle className="w-3 h-3" />
                      <span>Has mentor feedback</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
