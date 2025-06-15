'use client';

import { useState } from 'react';
import type { QuarterlyReview, LegacyLetter } from '../types/mentor';

export default function QuarterlyReview() {
  const [review, setReview] = useState<QuarterlyReview>({
    id: crypto.randomUUID(),
    quarter: Math.floor(new Date().getMonth() / 3) + 1,
    year: new Date().getFullYear(),
    fiveYearPlan: '',
    milestones: [],
    achievements: [],
    challenges: [],
    nextQuarterGoals: [],
  });

  const [legacyLetter, setLegacyLetter] = useState<LegacyLetter>({
    id: crypto.randomUUID(),
    year: new Date().getFullYear(),
    content: '',
    achievements: [],
    lessons: [],
    familyHopes: [],
    createdAt: new Date(),
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the review to your backend
    console.log('Saving quarterly review:', review);
  };

  const handleLegacyLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the legacy letter to your backend
    console.log('Saving legacy letter:', legacyLetter);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Quarterly Review & Legacy Planning</h1>

      {/* Quarterly Review Form */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Q{review.quarter} {review.year} Review</h2>
        <form onSubmit={handleReviewSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Five-Year Plan
            </label>
            <textarea
              value={review.fiveYearPlan}
              onChange={(e) => setReview({ ...review, fiveYearPlan: e.target.value })}
              className="w-full p-3 border rounded-lg"
              rows={4}
              placeholder="What is your vision for the next five years?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quarter Milestones
            </label>
            <textarea
              value={review.milestones.join('\n')}
              onChange={(e) => setReview({ ...review, milestones: e.target.value.split('\n') })}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="Enter each milestone on a new line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements
            </label>
            <textarea
              value={review.achievements.join('\n')}
              onChange={(e) => setReview({ ...review, achievements: e.target.value.split('\n') })}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="List your achievements for this quarter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Challenges
            </label>
            <textarea
              value={review.challenges.join('\n')}
              onChange={(e) => setReview({ ...review, challenges: e.target.value.split('\n') })}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="What challenges did you face this quarter?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Quarter Goals
            </label>
            <textarea
              value={review.nextQuarterGoals.join('\n')}
              onChange={(e) => setReview({ ...review, nextQuarterGoals: e.target.value.split('\n') })}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="What are your goals for the next quarter?"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Save Quarterly Review
          </button>
        </form>
      </section>

      {/* Legacy Letter Form */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Legacy Letter to Future Self</h2>
        <form onSubmit={handleLegacyLetterSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Letter Content
            </label>
            <textarea
              value={legacyLetter.content}
              onChange={(e) => setLegacyLetter({ ...legacyLetter, content: e.target.value })}
              className="w-full p-3 border rounded-lg"
              rows={6}
              placeholder="Write a letter to your future self..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Achievements
            </label>
            <textarea
              value={legacyLetter.achievements.join('\n')}
              onChange={(e) => setLegacyLetter({ ...legacyLetter, achievements: e.target.value.split('\n') })}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="List your key achievements"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lessons Learned
            </label>
            <textarea
              value={legacyLetter.lessons.join('\n')}
              onChange={(e) => setLegacyLetter({ ...legacyLetter, lessons: e.target.value.split('\n') })}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="What lessons have you learned?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family Hopes
            </label>
            <textarea
              value={legacyLetter.familyHopes.join('\n')}
              onChange={(e) => setLegacyLetter({ ...legacyLetter, familyHopes: e.target.value.split('\n') })}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="What are your hopes for your family?"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-500 text-white px-6 py-2 rounded-lg"
          >
            Save Legacy Letter
          </button>
        </form>
      </section>
    </div>
  );
} 