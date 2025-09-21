import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SessionDetails } from '../types';
import { EnhancedMindmap } from './EnhancedMindmap';
import { SessionQuiz } from './SessionQuiz';
import { BookOpenIcon, CheckSquareIcon, GitMergeIcon, AcademicCapIcon, LightBulbIcon, ChartBarIcon } from './Icons';

interface SessionViewProps {
  sessionDetails: SessionDetails;
  sessionTitle: string;
  onBack: () => void;
}

type TabType = 'content' | 'mindmap' | 'quiz';

// Sample quiz questions - in a real app, these would come from the AI
const generateQuizQuestions = (sessionDetails: SessionDetails) => [
  {
    id: '1',
    question: `What is the main learning objective of this session?`,
    options: [
      sessionDetails.learningObjective,
      'To complete all activities',
      'To understand basic concepts',
      'To finish quickly'
    ],
    correctAnswer: 0,
    explanation: 'The learning objective clearly states what you should be able to do after completing this session.'
  },
  {
    id: '2',
    question: `Which of the following is a key concept in this session?`,
    options: [
      sessionDetails.keyConcepts[0] || 'Basic understanding',
      'Advanced techniques',
      'Historical context',
      'Future applications'
    ],
    correctAnswer: 0,
    explanation: 'The key concepts are the most important ideas you need to understand from this session.'
  },
  {
    id: '3',
    question: `What type of activity is recommended for this session?`,
    options: [
      sessionDetails.activity.title,
      'Reading only',
      'Watching videos',
      'Taking notes'
    ],
    correctAnswer: 0,
    explanation: 'The recommended activity is specifically designed to reinforce your learning in this session.'
  }
];

export const SessionView: React.FC<SessionViewProps> = ({ sessionDetails, sessionTitle, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);

  const quizQuestions = generateQuizQuestions(sessionDetails);

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScore({ score, total });
  };

  const tabs = [
    { id: 'content' as TabType, label: 'Content', icon: BookOpenIcon, color: 'blue' },
    { id: 'mindmap' as TabType, label: 'Mind Map', icon: GitMergeIcon, color: 'purple' },
    { id: 'quiz' as TabType, label: 'Quiz', icon: AcademicCapIcon, color: 'green' }
  ];

  const getTabColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'from-blue-500 to-blue-600' : 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
      purple: isActive ? 'from-purple-500 to-purple-600' : 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
      green: isActive ? 'from-green-500 to-green-600' : 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30'
    };
    return colors[color as keyof typeof colors];
  };

  const getTabTextColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'text-white' : 'text-blue-700 dark:text-blue-300',
      purple: isActive ? 'text-white' : 'text-purple-700 dark:text-purple-300',
      green: isActive ? 'text-white' : 'text-green-700 dark:text-green-300'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-white">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-white/90 hover:text-white transition-colors duration-300 mb-4 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Course Outline</span>
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{sessionTitle}</h1>
          <p className="text-xl text-white/90">{sessionDetails.learningObjective}</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? `bg-gradient-to-r ${getTabColor(tab.color, true)} ${getTabTextColor(tab.color, true)} shadow-lg` 
                      : `bg-gradient-to-r ${getTabColor(tab.color, false)} ${getTabTextColor(tab.color, false)} hover:shadow-md`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.id === 'quiz' && quizScore && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      quizScore.score / quizScore.total >= 0.8 ? 'bg-green-500' :
                      quizScore.score / quizScore.total >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {quizScore.score}/{quizScore.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'content' && (
            <div className="space-y-8">
              {/* Key Concepts */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3 mb-4">
                  <LightBulbIcon className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Key Concepts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sessionDetails.keyConcepts.map((concept, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-blue-100 dark:border-blue-800">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{concept}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Content */}
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3 mb-6">
                  <BookOpenIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Session Content</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300">
                  <ReactMarkdown>{sessionDetails.sessionContent}</ReactMarkdown>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckSquareIcon className="w-6 h-6 text-green-500" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{sessionDetails.activity.title}</h2>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-green-100 dark:border-green-800">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{sessionDetails.activity.description}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mindmap' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Concept Map</h2>
                <p className="text-slate-600 dark:text-slate-400">Interactive visualization of key concepts and their relationships</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <EnhancedMindmap data={sessionDetails.mindMap} className="min-h-[400px]" />
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Knowledge Check</h2>
                <p className="text-slate-600 dark:text-slate-400">Test your understanding of this session's content</p>
                {quizScore && (
                  <div className="mt-4 inline-flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700">
                    <ChartBarIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Last Score: {quizScore.score}/{quizScore.total} ({Math.round((quizScore.score / quizScore.total) * 100)}%)
                    </span>
                  </div>
                )}
              </div>
              <SessionQuiz questions={quizQuestions} onComplete={handleQuizComplete} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
