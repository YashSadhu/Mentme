'use client';

import { useState, useEffect } from 'react';
import { DailyTask, StretchChallenge, Mood, WeeklyReview } from '../types/mentor';
import { generateDailyTask, generateStretchChallenge, getMoodBasedActivity, getSpiritualQuestion, adjustTaskDifficulty } from '../utils/mentorUtils';

export default function AIMentor() {
  const [currentTask, setCurrentTask] = useState<DailyTask | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<StretchChallenge | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [moodActivity, setMoodActivity] = useState<string>('');
  const [spiritualQuestion, setSpiritualQuestion] = useState<string>('');
  const [reflection, setReflection] = useState<string>('');
  const [previousTasks, setPreviousTasks] = useState<DailyTask[]>([]);

  useEffect(() => {
    // Check if it's Sunday for stretch challenge
    const isSunday = new Date().getDay() === 0;
    if (isSunday) {
      setCurrentChallenge(generateStretchChallenge([]));
    }

    // Generate daily task
    setCurrentTask(generateDailyTask(previousTasks));
  }, []);

  const handleMoodSelect = (selectedMood: Mood) => {
    setMood(selectedMood);
    setMoodActivity(getMoodBasedActivity(selectedMood));
  };

  const handleTaskComplete = () => {
    if (currentTask) {
      const completedTask = {
        ...currentTask,
        completed: true,
        completedAt: new Date(),
        reflection,
      };
      setPreviousTasks([...previousTasks, completedTask]);
      setCurrentTask(null);
      setReflection('');
    }
  };

  const handleChallengeComplete = () => {
    if (currentChallenge) {
      const completedChallenge = {
        ...currentChallenge,
        completed: true,
        completedAt: new Date(),
        reflection,
      };
      setCurrentChallenge(null);
      setReflection('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">AI Mentor</h1>

      {/* Mood Check-in */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        <div className="grid grid-cols-2 gap-4">
          {(['motivated', 'anxious', 'peaceful', 'overwhelmed'] as Mood[]).map((m) => (
            <button
              key={m}
              onClick={() => handleMoodSelect(m)}
              className={`p-4 rounded-lg ${
                mood === m ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        {moodActivity && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p>{moodActivity}</p>
          </div>
        )}
      </section>

      {/* Daily Task */}
      {currentTask && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today's Focus Task</h2>
          <div className="space-y-4">
            <h3 className="font-medium">{currentTask.title}</h3>
            <p className="text-gray-600">{currentTask.description}</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you learn about yourself while doing this task?"
              className="w-full p-3 border rounded-lg"
              rows={3}
            />
            <button
              onClick={handleTaskComplete}
              className="bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Complete Task
            </button>
          </div>
        </section>
      )}

      {/* Stretch Challenge */}
      {currentChallenge && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weekly Stretch Challenge</h2>
          <div className="space-y-4">
            <h3 className="font-medium">{currentChallenge.title}</h3>
            <p className="text-gray-600">{currentChallenge.description}</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you learn about yourself while doing this challenge?"
              className="w-full p-3 border rounded-lg"
              rows={3}
            />
            <button
              onClick={handleChallengeComplete}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg"
            >
              Complete Challenge
            </button>
          </div>
        </section>
      )}

      {/* Spiritual Question (on Fridays) */}
      {new Date().getDay() === 5 && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weekly Reflection</h2>
          <p className="text-gray-600 mb-4">{spiritualQuestion || getSpiritualQuestion()}</p>
          <textarea
            placeholder="Your reflection..."
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
        </section>
      )}
    </div>
  );
} 