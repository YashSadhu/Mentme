import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: string
  preferences: {
    favoriteTopics: string[]
    preferredSessionLength: string
    communicationStyle: string
    goals: string[]
  }
  progress: {
    totalSessions: number
    totalMinutes: number
    streakDays: number
    completedChallenges: number
    journalEntries: number
  }
  mentorshipHistory: Array<{
    mentorId: string
    mentorName: string
    sessionType: string
    date: string
    duration: number
    rating?: number
    notes?: string
  }>
  journalEntries: Array<{
    id: string
    date: string
    title: string
    content: string
    mentorFeedback?: string
    mentorId?: string
    tags: string[]
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    unlockedDate: string
    icon: string
  }>
}

interface UserStore {
  user: UserProfile | null
  isAuthenticated: boolean
  setUser: (user: UserProfile) => void
  updateProgress: (updates: Partial<UserProfile["progress"]>) => void
  addSession: (session: UserProfile["mentorshipHistory"][0]) => void
  addJournalEntry: (entry: UserProfile["journalEntries"][0]) => void
  updateJournalEntry: (id: string, updates: Partial<UserProfile["journalEntries"][0]>) => void
  addAchievement: (achievement: UserProfile["achievements"][0]) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      updateProgress: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                progress: { ...state.user.progress, ...updates },
              }
            : null,
        })),

      addSession: (session) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                mentorshipHistory: [session, ...state.user.mentorshipHistory],
                progress: {
                  ...state.user.progress,
                  totalSessions: state.user.progress.totalSessions + 1,
                  totalMinutes: state.user.progress.totalMinutes + session.duration,
                },
              }
            : null,
        })),

      addJournalEntry: (entry) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                journalEntries: [entry, ...state.user.journalEntries],
                progress: {
                  ...state.user.progress,
                  journalEntries: state.user.progress.journalEntries + 1,
                },
              }
            : null,
        })),

      updateJournalEntry: (id, updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                journalEntries: state.user.journalEntries.map((entry) =>
                  entry.id === id ? { ...entry, ...updates } : entry,
                ),
              }
            : null,
        })),

      addAchievement: (achievement) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                achievements: [achievement, ...state.user.achievements],
              }
            : null,
        })),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "timeless-mentors-user",
    },
  ),
)

// Initialize demo user if none exists
export const initializeDemoUser = () => {
  const { user, setUser } = useUserStore.getState()
  if (!user) {
    const demoUser: UserProfile = {
      id: "demo-user-1",
      name: "Demo User",
      email: "demo@timelessmentors.com",
      joinDate: new Date().toISOString(),
      preferences: {
        favoriteTopics: ["Entrepreneurship", "Philosophy", "Personal Growth"],
        preferredSessionLength: "15-30 minutes",
        communicationStyle: "Direct and practical",
        goals: ["Build a successful startup", "Develop leadership skills", "Find life purpose"],
      },
      progress: {
        totalSessions: 12,
        totalMinutes: 340,
        streakDays: 5,
        completedChallenges: 3,
        journalEntries: 8,
      },
      mentorshipHistory: [
        {
          mentorId: "naval-ravikant",
          mentorName: "Naval Ravikant",
          sessionType: "Daily Check-in",
          date: new Date().toISOString(),
          duration: 10,
          rating: 5,
          notes: "Great insights on building wealth through leverage",
        },
      ],
      journalEntries: [
        {
          id: "journal-1",
          date: new Date().toISOString(),
          title: "Reflections on Leverage",
          content: "Today I learned about the different types of leverage from Naval...",
          tags: ["leverage", "wealth", "entrepreneurship"],
        },
      ],
      achievements: [
        {
          id: "first-session",
          title: "First Session",
          description: "Completed your first mentorship session",
          unlockedDate: new Date().toISOString(),
          icon: "🎯",
        },
      ],
    }
    setUser(demoUser)
  }
}
