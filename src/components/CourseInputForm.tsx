import React, { useState } from 'react';
import { CourseParams, Difficulty } from '../types';
import { BrainCircuitIcon, StarIcon, ClockIcon, UserIcon } from './Icons';

interface CourseInputFormProps {
  onSubmit: (params: CourseParams) => void;
  isLoading: boolean;
}

export const CourseInputForm: React.FC<CourseInputFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [durationInWeeks, setDurationInWeeks] = useState(8);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit({ topic, durationInWeeks, difficulty });
    }
  };

  const difficultyColors = {
    [Difficulty.Beginner]: 'from-green-500 to-emerald-600',
    [Difficulty.Intermediate]: 'from-yellow-500 to-orange-600',
    [Difficulty.Advanced]: 'from-red-500 to-pink-600',
    [Difficulty.Expert]: 'from-purple-500 to-indigo-600'
  };

  const difficultyIcons = {
    [Difficulty.Beginner]: '🌱',
    [Difficulty.Intermediate]: '🚀',
    [Difficulty.Advanced]: '⚡',
    [Difficulty.Expert]: '🏆'
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-bounce-in">
          <BrainCircuitIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold gradient-text mb-4">AI Course Generator</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Create personalized learning experiences tailored to your style, pace, and goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-3xl p-8 border border-slate-200 dark:border-slate-700 animate-slide-in-left">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Course Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                What would you like to learn?
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quantum Computing, Machine Learning, Digital Marketing..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-400">💡</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Course Duration
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="duration"
                  value={durationInWeeks}
                  onChange={(e) => setDurationInWeeks(parseInt(e.target.value, 10))}
                  min="1"
                  max="52"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ClockIcon className="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Choose between 1-52 weeks</p>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(Difficulty).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      difficulty === level
                        ? `border-blue-500 bg-blue-50 dark:bg-blue-900/20 ${difficultyColors[level]} text-white`
                        : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{difficultyIcons[level]}</div>
                      <div className={`text-sm font-semibold ${
                        difficulty === level ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {level}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Your Course...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Start Learning Journey</span>
                  <StarIcon className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Features Section */}
        <div className="space-y-6 animate-slide-in-right">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">AI-Powered Assessment</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Our AI analyzes your learning style through personalized questions to create the perfect course for you.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Personalized Content</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Get content tailored to your learning style with interactive sessions, activities, and concept maps.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">📚</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Interactive Learning</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Engage with quizzes, mind maps, and hands-on activities designed to reinforce your learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
