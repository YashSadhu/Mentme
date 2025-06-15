import { DailyTask, StretchChallenge, Mood } from '../types/mentor';

const SPIRITUAL_QUESTIONS = [
  "Which limiting belief surfaced this week, and how can I replace it?",
  "How has your family's support influenced your choices this week?",
  "What moments of growth did you experience this week?",
  "How did you practice self-compassion this week?",
  "What values were most important to you this week?",
];

const BREATHING_EXERCISES = [
  "Take 4 deep breaths, inhaling for 4 counts and exhaling for 4 counts.",
  "Practice box breathing: inhale 4 counts, hold 4 counts, exhale 4 counts, hold 4 counts.",
  "Take 5 deep breaths, focusing on the sensation of air moving through your body.",
];

export function generateDailyTask(previousTasks: DailyTask[]): DailyTask {
  // This would be replaced with actual AI integration
  const task = {
    id: crypto.randomUUID(),
    title: "Read 20 minutes of Cadence Virtuoso's PMOS tutorial",
    description: "Read and summarize three key takeaways from the tutorial.",
    completed: false,
    createdAt: new Date(),
  };
  return task;
}

export function generateStretchChallenge(previousChallenges: StretchChallenge[]): StretchChallenge {
  // This would be replaced with actual AI integration
  const challenge = {
    id: crypto.randomUUID(),
    title: "Design and simulate a 2:1 Verilog multiplexer",
    description: "Create a 2:1 multiplexer in Verilog and write a brief rationale for your design choices.",
    difficulty: 7,
    completed: false,
    createdAt: new Date(),
  };
  return challenge;
}

export function getMoodBasedActivity(mood: Mood): string {
  switch (mood) {
    case 'anxious':
      return BREATHING_EXERCISES[Math.floor(Math.random() * BREATHING_EXERCISES.length)];
    case 'overwhelmed':
      return "Take a 5-minute break to write down your top 3 priorities for today.";
    case 'peaceful':
      return "Reflect on what's contributing to your peace and how to maintain it.";
    case 'motivated':
      return "Channel your motivation by setting a specific, time-bound goal for today.";
    default:
      return "Take a moment to check in with yourself and set an intention for the day.";
  }
}

export function getSpiritualQuestion(): string {
  return SPIRITUAL_QUESTIONS[Math.floor(Math.random() * SPIRITUAL_QUESTIONS.length)];
}

export function adjustTaskDifficulty(previousTasks: DailyTask[]): number {
  const recentTasks = previousTasks.slice(-7); // Last 7 days
  const completedOnTime = recentTasks.filter(task => {
    if (!task.completedAt) return false;
    const completionTime = task.completedAt.getTime() - task.createdAt.getTime();
    return completionTime <= 10 * 60 * 1000; // 10 minutes in milliseconds
  }).length;

  if (completedOnTime >= 5) {
    return 1.2; // Increase difficulty by 20%
  } else if (completedOnTime <= 2) {
    return 0.8; // Decrease difficulty by 20%
  }
  return 1; // Maintain current difficulty
} 