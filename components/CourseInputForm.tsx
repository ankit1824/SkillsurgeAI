
import React, { useState } from 'react';
import { CourseParams, Difficulty } from '../types';
import { BrainCircuitIcon } from './Icons';

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

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8 transform transition-all duration-500 hover:scale-105">
        <div className="text-center mb-8">
            <BrainCircuitIcon className="w-16 h-16 text-sky-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">AI Course Generator</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Craft your personalized learning journey.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Course Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quantum Computing"
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Course Duration (Weeks)
            </label>
            <input
              type="number"
              id="duration"
              value={durationInWeeks}
              onChange={(e) => setDurationInWeeks(parseInt(e.target.value, 10))}
              min="1"
              max="52"
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-slate-900 dark:text-white"
            >
              {Object.values(Difficulty).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? 'Initializing...' : 'Start Learning'}
          </button>
        </form>
      </div>
    </div>
  );
};
