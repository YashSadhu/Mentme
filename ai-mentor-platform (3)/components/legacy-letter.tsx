"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Star, Target, ArrowLeft, Save, Mail } from "lucide-react"

interface LegacyLetterProps {
  onBack: () => void
}

export default function LegacyLetter({ onBack }: LegacyLetterProps) {
  const [achievements, setAchievements] = useState<string[]>([])
  const [lessonsLearned, setLessonsLearned] = useState<string[]>([])
  const [familyHopes, setFamilyHopes] = useState<string[]>([])
  const [futureGoals, setFutureGoals] = useState<string[]>([])
  const [personalGrowth, setPersonalGrowth] = useState("")
  const [fullLetter, setFullLetter] = useState("")

  const [newAchievement, setNewAchievement] = useState("")
  const [newLesson, setNewLesson] = useState("")
  const [newHope, setNewHope] = useState("")
  const [newGoal, setNewGoal] = useState("")

  const currentYear = new Date().getFullYear()

  const addItem = (
    item: string,
    setter: (items: string[]) => void,
    current: string[],
    inputSetter: (value: string) => void,
  ) => {
    if (item.trim()) {
      setter([...current, item.trim()])
      inputSetter("")
    }
  }

  const removeItem = (index: number, setter: (items: string[]) => void, current: string[]) => {
    setter(current.filter((_, i) => i !== index))
  }

  const generateLetter = () => {
    const letter = `Dear Future Me,

As I write this on ${new Date().toLocaleDateString()}, I want to capture this moment in time and share what ${currentYear} has meant to me.

ACHIEVEMENTS THIS YEAR:
${achievements.map((a) => `• ${a}`).join("\n")}

LESSONS I'VE LEARNED:
${lessonsLearned.map((l) => `• ${l}`).join("\n")}

HOPES FOR OUR FAMILY:
${familyHopes.map((h) => `• ${h}`).join("\n")}

GOALS FOR THE FUTURE:
${futureGoals.map((g) => `• ${g}`).join("\n")}

PERSONAL GROWTH REFLECTION:
${personalGrowth}

I hope when you read this, you'll remember not just what we accomplished, but who we became in the process. The struggles that seemed overwhelming at the time, the small victories that felt so meaningful, and the people who supported us along the way.

Keep growing, keep learning, and never forget that every day is a chance to become a better version of ourselves.

With love and hope,
Your Past Self
${new Date().toLocaleDateString()}`

    setFullLetter(letter)
  }

  const handleSaveLetter = () => {
    const letter = {
      id: `letter-${Date.now()}`,
      date: new Date().toISOString(),
      year: currentYear,
      achievements,
      lessonsLearned,
      familyHopes,
      futureGoals,
      personalGrowth,
      fullLetter,
    }

    console.log("Saving legacy letter:", letter)
    // Here you would save to your task engine
    onBack()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Annual Legacy Letter</h1>
              <p className="text-gray-600">{currentYear} • 30-minute reflection to your future self</p>
            </div>
          </div>
          <Button onClick={handleSaveLetter}>
            <Save className="w-4 h-4 mr-2" />
            Save Letter
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="letter">Letter</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Achievements of {currentYear}
                </CardTitle>
                <p className="text-sm text-gray-600">What are you most proud of accomplishing this year?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an achievement from this year..."
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(newAchievement, setAchievements, achievements, setNewAchievement)
                      }
                    }}
                  />
                  <Button onClick={() => addItem(newAchievement, setAchievements, achievements, setNewAchievement)}>
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span>{achievement}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index, setAchievements, achievements)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Reflection Prompts</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• What goals did you accomplish that you're most proud of?</li>
                    <li>• What skills did you develop or master?</li>
                    <li>• What challenges did you overcome?</li>
                    <li>• What positive impact did you make on others?</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Lessons Learned
                </CardTitle>
                <p className="text-sm text-gray-600">What wisdom have you gained this year?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a lesson you learned this year..."
                    value={newLesson}
                    onChange={(e) => setNewLesson(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(newLesson, setLessonsLearned, lessonsLearned, setNewLesson)
                      }
                    }}
                  />
                  <Button onClick={() => addItem(newLesson, setLessonsLearned, lessonsLearned, setNewLesson)}>
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {lessonsLearned.map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>{lesson}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index, setLessonsLearned, lessonsLearned)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Consider These Areas</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• What mistakes taught you valuable lessons?</li>
                    <li>• What beliefs about yourself changed this year?</li>
                    <li>• What patterns in your behavior did you notice?</li>
                    <li>• What advice would you give to someone in your past situation?</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Future Goals
                </CardTitle>
                <p className="text-sm text-gray-600">What do you want to accomplish in the coming years?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a future goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(newGoal, setFutureGoals, futureGoals, setNewGoal)
                      }
                    }}
                  />
                  <Button onClick={() => addItem(newGoal, setFutureGoals, futureGoals, setNewGoal)}>Add</Button>
                </div>

                <div className="space-y-2">
                  {futureGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span>{goal}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(index, setFutureGoals, futureGoals)}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Family Hopes & Dreams
                </CardTitle>
                <p className="text-sm text-gray-600">What are your hopes and dreams for your family?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a hope for your family..."
                    value={newHope}
                    onChange={(e) => setNewHope(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(newHope, setFamilyHopes, familyHopes, setNewHope)
                      }
                    }}
                  />
                  <Button onClick={() => addItem(newHope, setFamilyHopes, familyHopes, setNewHope)}>Add</Button>
                </div>

                <div className="space-y-2">
                  {familyHopes.map((hope, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span>{hope}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(index, setFamilyHopes, familyHopes)}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-pink-50 rounded-lg">
                  <h4 className="font-semibold text-pink-800 mb-2">Family Reflection</h4>
                  <ul className="text-sm text-pink-700 space-y-1">
                    <li>• How do you want your family to grow together?</li>
                    <li>• What traditions do you want to create or continue?</li>
                    <li>• What values do you want to instill?</li>
                    <li>• How do you want to support each family member's dreams?</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Growth Reflection</CardTitle>
                <p className="text-sm text-gray-600">
                  Write a deeper reflection on how you've grown as a person this year
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Reflect on your personal growth journey this year. How have you changed? What have you discovered about yourself? What are you most grateful for in your development?"
                  value={personalGrowth}
                  onChange={(e) => setPersonalGrowth(e.target.value)}
                  rows={8}
                  className="w-full"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">Growth Areas to Consider</h4>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      <li>• Emotional intelligence and self-awareness</li>
                      <li>• Resilience and how you handle challenges</li>
                      <li>• Relationships and communication skills</li>
                      <li>• Professional and technical development</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2">Questions to Explore</h4>
                    <ul className="text-sm text-teal-700 space-y-1">
                      <li>• What surprised you most about yourself?</li>
                      <li>• What limiting beliefs did you overcome?</li>
                      <li>• How did your perspective on life change?</li>
                      <li>• What are you most proud of becoming?</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="letter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-500" />
                  Your Legacy Letter
                </CardTitle>
                <p className="text-sm text-gray-600">Generate and customize your letter to your future self</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {!fullLetter ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Complete the previous sections, then generate your letter</p>
                    <Button onClick={generateLetter} disabled={achievements.length === 0}>
                      Generate Letter
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Your Legacy Letter for {currentYear}</h3>
                      <Button variant="outline" onClick={generateLetter}>
                        Regenerate
                      </Button>
                    </div>

                    <Textarea
                      value={fullLetter}
                      onChange={(e) => setFullLetter(e.target.value)}
                      rows={20}
                      className="w-full font-mono text-sm"
                    />

                    <div className="flex gap-2">
                      <Button onClick={handleSaveLetter} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Save Letter
                      </Button>
                      <Button variant="outline" onClick={() => navigator.clipboard.writeText(fullLetter)}>
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {fullLetter && (
              <Card>
                <CardHeader>
                  <CardTitle>Letter Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{achievements.length}</div>
                      <div className="text-sm text-gray-600">Achievements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{lessonsLearned.length}</div>
                      <div className="text-sm text-gray-600">Lessons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{familyHopes.length}</div>
                      <div className="text-sm text-gray-600">Family Hopes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{futureGoals.length}</div>
                      <div className="text-sm text-gray-600">Future Goals</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
