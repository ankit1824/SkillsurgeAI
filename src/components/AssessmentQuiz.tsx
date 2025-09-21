import React, { useState } from 'react';
import { AssessmentQuestion } from '../types';
import { CheckSquareIcon } from './Icons';

interface AssessmentQuizProps {
  questions: AssessmentQuestion[];
  onSubmit: (answers: string[]) => void;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ questions, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onSubmit(newAnswers);
      }
    }
  };

  if (!questions || questions.length === 0) {
    return (
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assessment Error</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Could not load assessment questions.</p>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  if (!currentQuestion) {
     return (
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assessment Error</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">There was an issue loading the current question.</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Learning Style Assessment</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Answer a few questions to personalize your course.</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-sky-700 dark:text-sky-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">{currentQuestion.question}</h3>
        </div>

        <div className="space-y-4">
          {currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedOption === option
                  ? 'bg-sky-100 dark:bg-sky-900 border-sky-500 ring-2 ring-sky-500'
                  : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
              }`}
            >
              <span className="font-medium text-slate-800 dark:text-slate-200">{option}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};