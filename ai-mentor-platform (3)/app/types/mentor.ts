export type Mood = 'motivated' | 'anxious' | 'peaceful' | 'overwhelmed';

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  reflection?: string;
}

export interface StretchChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: number; // 1-10
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  reflection?: string;
}

export interface WeeklyReview {
  id: string;
  date: Date;
  mood: Mood;
  completedTasks: number;
  totalTasks: number;
  spiritualQuestion: string;
  spiritualAnswer?: string;
  reflection?: string;
}

export interface QuarterlyReview {
  id: string;
  quarter: number;
  year: number;
  fiveYearPlan: string;
  milestones: string[];
  achievements: string[];
  challenges: string[];
  nextQuarterGoals: string[];
}

export interface LegacyLetter {
  id: string;
  year: number;
  content: string;
  achievements: string[];
  lessons: string[];
  familyHopes: string[];
  createdAt: Date;
} 