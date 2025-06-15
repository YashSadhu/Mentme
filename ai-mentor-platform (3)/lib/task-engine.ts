import { create } from "zustand"
import { persist } from "zustand/middleware"

interface DailyTask {
  id: string
  date: string
  title: string
  description: string
  goalCategory: string
  estimatedMinutes: number
  completed: boolean
  completedAt?: string
  completionTime?: number
  reflection?: string
  selfLearning?: string
  familyInfluence?: string
  difficulty: "easy" | "medium" | "hard"
  type: "reading" | "practice" | "reflection" | "creation" | "analysis"
}

interface StretchChallenge {
  id: string
  weekOf: string
  title: string
  description: string
  rationale: string
  completed: boolean
  completedAt?: string
  reflection?: string
  difficultyIncrease: number
  nextChallengeAdjustment: number
}

interface MoodEntry {
  id: string
  date: string
  mood: "motivated" | "anxious" | "peaceful" | "overwhelmed" | "focused" | "tired"
  morningExercise?: string
  adaptedTone: string
}

interface Milestone {
  id: string
  date: string
  type: "daily-task" | "stretch-challenge" | "weekly-goal" | "monthly-goal"
  title: string
  reflection: string
  selfLearning: string
  improvementArea: string
  tags: string[]
}

interface VisionReview {
  id: string
  date: string
  quarter: string
  year: number
  fiveYearVision: string
  quarterlyMilestones: string[]
  achievements: string[]
  adjustments: string[]
  nextQuarterFocus: string[]
}

interface LegacyLetter {
  id: string
  date: string
  year: number
  achievements: string[]
  lessonsLearned: string[]
  familyHopes: string[]
  futureGoals: string[]
  personalGrowth: string
  fullLetter: string
}

interface TaskEngineState {
  // Current state
  currentGoal: string
  currentDifficulty: number
  weeklyPerformance: number[]
  consecutiveMisses: number
  consecutiveCompletions: number

  // Data stores
  dailyTasks: DailyTask[]
  stretchChallenges: StretchChallenge[]
  moodEntries: MoodEntry[]
  milestones: Milestone[]
  visionReviews: VisionReview[]
  legacyLetters: LegacyLetter[]

  // Actions
  setCurrentGoal: (goal: string) => void
  generateDailyTask: (date: string, mood?: string) => DailyTask
  completeTask: (taskId: string, completionTime: number, reflection?: string) => void
  addMoodEntry: (mood: string) => MoodEntry
  generateStretchChallenge: () => StretchChallenge
  addMilestoneReflection: (milestone: Milestone) => void
  conductVisionReview: (review: VisionReview) => void
  createLegacyLetter: (letter: LegacyLetter) => void
  getAccountabilityCheck: () => string
  adjustDifficulty: () => void
  getWeeklySpiritual: () => string
  getRecurringThemes: () => string[]
}

export const useTaskEngine = create<TaskEngineState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentGoal: "Master VLSI Design and Personal Growth",
      currentDifficulty: 50,
      weeklyPerformance: [],
      consecutiveMisses: 0,
      consecutiveCompletions: 0,

      // Data stores
      dailyTasks: [],
      stretchChallenges: [],
      moodEntries: [],
      milestones: [],
      visionReviews: [],
      legacyLetters: [],

      setCurrentGoal: (goal) => set({ currentGoal: goal }),

      generateDailyTask: (date, mood) => {
        const state = get()
        const difficulty = state.currentDifficulty
        const goalCategory = state.currentGoal

        // Task templates based on difficulty and goal
        const taskTemplates = {
          easy: [
            {
              title: "VLSI Fundamentals Reading",
              description: "Read 10 minutes of Cadence Virtuoso's PMOS tutorial and note two key concepts",
              type: "reading" as const,
              estimatedMinutes: 15,
              goalCategory: "Technical Learning",
            },
            {
              title: "Daily Reflection",
              description: "Write a 5-minute reflection on today's learning goals",
              type: "reflection" as const,
              estimatedMinutes: 10,
              goalCategory: "Personal Growth",
            },
          ],
          medium: [
            {
              title: "PMOS Tutorial Deep Dive",
              description: "Read 20 minutes of Cadence Virtuoso's PMOS tutorial and summarize three takeaways",
              type: "reading" as const,
              estimatedMinutes: 25,
              goalCategory: "Technical Learning",
            },
            {
              title: "Circuit Analysis Practice",
              description: "Analyze a simple CMOS inverter circuit and document the switching behavior",
              type: "practice" as const,
              estimatedMinutes: 30,
              goalCategory: "Technical Skills",
            },
          ],
          hard: [
            {
              title: "Advanced VLSI Concepts",
              description:
                "Study advanced PMOS characteristics, create a summary document, and identify three practical applications",
              type: "analysis" as const,
              estimatedMinutes: 45,
              goalCategory: "Technical Mastery",
            },
            {
              title: "Design Challenge",
              description: "Design a basic logic gate using PMOS transistors and document the design rationale",
              type: "creation" as const,
              estimatedMinutes: 60,
              goalCategory: "Technical Creation",
            },
          ],
        }

        const difficultyLevel = difficulty < 30 ? "easy" : difficulty < 70 ? "medium" : "hard"
        const templates = taskTemplates[difficultyLevel]
        const template = templates[Math.floor(Math.random() * templates.length)]

        // Adjust for mood
        let adjustedDescription = template.description
        if (mood === "anxious") {
          adjustedDescription = "Start with a 2-minute breathing exercise, then: " + template.description
        } else if (mood === "overwhelmed") {
          adjustedDescription = template.description.replace(/\d+/, (match) =>
            String(Math.max(5, Number.parseInt(match) - 5)),
          )
        }

        const task: DailyTask = {
          id: `task-${Date.now()}`,
          date,
          title: template.title,
          description: adjustedDescription,
          goalCategory: template.goalCategory,
          estimatedMinutes: template.estimatedMinutes,
          completed: false,
          difficulty: difficultyLevel,
          type: template.type,
        }

        set((state) => ({
          dailyTasks: [...state.dailyTasks, task],
        }))

        return task
      },

      completeTask: (taskId, completionTime, reflection) => {
        set((state) => {
          const updatedTasks = state.dailyTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed: true,
                  completedAt: new Date().toISOString(),
                  completionTime,
                  reflection,
                }
              : task,
          )

          // Update performance tracking
          const newPerformance = [...state.weeklyPerformance, completionTime]
          const newConsecutiveCompletions = state.consecutiveCompletions + 1

          return {
            dailyTasks: updatedTasks,
            weeklyPerformance: newPerformance.slice(-7), // Keep last 7 days
            consecutiveCompletions: newConsecutiveCompletions,
            consecutiveMisses: 0,
          }
        })

        // Schedule evening reflection
        setTimeout(() => {
          get().scheduleEveningReflection(taskId)
        }, 1000)
      },

      addMoodEntry: (mood) => {
        const entry: MoodEntry = {
          id: `mood-${Date.now()}`,
          date: new Date().toISOString(),
          mood: mood as any,
          adaptedTone:
            mood === "anxious"
              ? "calm and supportive"
              : mood === "overwhelmed"
                ? "gentle and simplified"
                : mood === "motivated"
                  ? "energetic and challenging"
                  : "balanced",
        }

        if (mood === "anxious") {
          entry.morningExercise =
            "Take 5 deep breaths: inhale for 4 counts, hold for 4, exhale for 6. Focus on releasing tension with each exhale."
        }

        set((state) => ({
          moodEntries: [...state.moodEntries, entry],
        }))

        return entry
      },

      generateStretchChhallenege: () => {
        const state = get()
        const weekOf = new Date().toISOString().split("T")[0]

        const challenges = [
          {
            title: "Verilog Multiplexer Design",
            description: "Design and simulate a 2:1 Verilog multiplexer with testbench",
            rationale: "Understanding multiplexers is fundamental to digital design and will enhance your HDL skills",
            difficultyIncrease: 25,
          },
          {
            title: "CMOS Layout Challenge",
            description: "Create a layout for a NAND gate using Cadence Virtuoso and verify DRC",
            rationale: "Hands-on layout experience bridges theory and practical implementation",
            difficultyIncrease: 30,
          },
          {
            title: "Power Analysis Project",
            description: "Analyze power consumption of a simple digital circuit and propose optimization",
            rationale: "Power analysis is crucial in modern VLSI design and will deepen your understanding",
            difficultyIncrease: 35,
          },
        ]

        const challenge = challenges[Math.floor(Math.random() * challenges.length)]

        const stretchChallenge: StretchChallenge = {
          id: `challenge-${Date.now()}`,
          weekOf,
          ...challenge,
          completed: false,
          nextChallengeAdjustment: 0,
        }

        set((state) => ({
          stretchChallenges: [...state.stretchChallenges, stretchChallenge],
        }))

        return stretchChallenge
      },

      addMilestoneReflection: (milestone) => {
        set((state) => ({
          milestones: [...state.milestones, milestone],
        }))
      },

      conductVisionReview: (review) => {
        set((state) => ({
          visionReviews: [...state.visionReviews, review],
        }))
      },

      createLegacyLetter: (letter) => {
        set((state) => ({
          legacyLetters: [...state.legacyLetters, letter],
        }))
      },

      getAccountabilityCheck: () => {
        const state = get()
        const recentTasks = state.dailyTasks.slice(-7)
        const completedTasks = recentTasks.filter((t) => t.completed).length
        const completionRate = completedTasks / recentTasks.length

        if (completionRate < 0.5) {
          return "I notice you've missed several tasks this week. What's blocking you? Let's break your next goal into smaller, more manageable steps."
        } else if (completionRate > 0.8) {
          return "Excellent consistency this week! You've earned a reward. Consider treating yourself to something you enjoy - you've demonstrated real commitment to your growth."
        } else {
          return "You're making steady progress. What's working well for you, and what could we adjust to make tomorrow even better?"
        }
      },

      adjustDifficulty: () => {
        set((state) => {
          const recentPerformance = state.weeklyPerformance.slice(-7)
          const avgTime = recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length

          let newDifficulty = state.currentDifficulty
          let newConsecutiveMisses = state.consecutiveMisses

          // If consistently finishing under 10 minutes for a week
          if (recentPerformance.length >= 7 && avgTime < 10) {
            newDifficulty = Math.min(100, state.currentDifficulty + 15)
          }

          // If missing two consecutive tasks
          if (state.consecutiveMisses >= 2) {
            newDifficulty = Math.max(10, state.currentDifficulty - 20)
            newConsecutiveMisses = 0
          }

          return {
            currentDifficulty: newDifficulty,
            consecutiveMisses: newConsecutiveMisses,
          }
        })
      },

      getWeeklySpiritual: () => {
        const questions = [
          "Which limiting belief surfaced this week, and how can I replace it with a more empowering truth?",
          "What pattern in my thinking or behavior did I notice this week that I want to change?",
          "How did my family's support or challenges influence my choices this week?",
          "What am I most grateful for in my growth journey this week?",
          "What fear did I face this week, and how did it teach me about my strength?",
          "How did I show up differently this week compared to last week?",
          "What would my future self want me to know about this week's experiences?",
        ]

        return questions[Math.floor(Math.random() * questions.length)]
      },

      getRecurringThemes: () => {
        const state = get()
        const allReflections = [
          ...state.milestones.flatMap((m) => m.tags),
          ...state.dailyTasks.filter((t) => t.reflection).flatMap((t) => t.reflection!.toLowerCase().split(" ")),
        ]

        const themes = ["focus", "family", "technical", "confidence", "time-management", "creativity", "persistence"]
        return themes.filter((theme) => allReflections.some((reflection) => reflection.includes(theme)))
      },

      scheduleEveningReflection: (taskId: string) => {
        // This would trigger an evening notification/prompt
        console.log(`Evening reflection scheduled for task ${taskId}`)
      },
    }),
    {
      name: "task-engine-storage",
    },
  ),
)

// Helper functions for task generation
export const generateMorningPrompt = (mood: string, task: DailyTask) => {
  const moodPrompts = {
    motivated: `Great energy today! Here's your focused task: ${task.title}. ${task.description}`,
    anxious: `I sense some tension. Let's start with a calming breath exercise, then tackle: ${task.title}. ${task.description}`,
    peaceful: `What a serene morning. Perfect for focused work: ${task.title}. ${task.description}`,
    overwhelmed: `Feeling a lot right now? Let's simplify. Here's one small step: ${task.title}. ${task.description}`,
    focused: `Your focus is sharp today. Channel it into: ${task.title}. ${task.description}`,
    tired: `Low energy is okay. Here's a gentle task to build momentum: ${task.title}. ${task.description}`,
  }

  return moodPrompts[mood as keyof typeof moodPrompts] || moodPrompts.focused
}

export const generateEveningPrompt = (task: DailyTask) => {
  return `Reflecting on today's task "${task.title}": What did I learn about myself today, and how did my family's support influence my choices?`
}
