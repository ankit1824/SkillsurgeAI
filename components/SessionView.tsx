// Fix: Create SessionView component to display session details.
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SessionDetails } from '../types';
import { SvgMindmap } from './SvgMindmap';
import { BookOpenIcon, CheckSquareIcon, GitMergeIcon } from './Icons';

interface SessionViewProps {
  sessionDetails: SessionDetails;
  sessionTitle: string;
  onBack: () => void;
}

export const SessionView: React.FC<SessionViewProps> = ({ sessionDetails, sessionTitle, onBack }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8">
        <div className="mb-8">
            <button
                onClick={onBack}
                className="text-sky-600 dark:text-sky-400 hover:underline mb-4 text-sm font-medium"
            >
                &larr; Back to Course Outline
            </button>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{sessionTitle}</h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{sessionDetails.learningObjective}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Session Content */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                        <BookOpenIcon className="w-6 h-6 text-sky-500" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Session Content</h2>
                    </div>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <ReactMarkdown>{sessionDetails.sessionContent}</ReactMarkdown>
                    </div>
                </div>

                {/* Activity */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                        <CheckSquareIcon className="w-6 h-6 text-teal-500" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{sessionDetails.activity.title}</h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{sessionDetails.activity.description}</p>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
                 {/* Key Concepts */}
                <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Key Concepts</h3>
                    <ul className="space-y-2">
                        {sessionDetails.keyConcepts.map((concept, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-sky-500 font-bold mr-2">&#8226;</span>
                                <span className="text-slate-700 dark:text-slate-300">{concept}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mind Map */}
                <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <GitMergeIcon className="w-6 h-6 text-sky-500" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Concept Map</h3>
                    </div>
                   {sessionDetails.mindMap && <SvgMindmap data={sessionDetails.mindMap} />}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
