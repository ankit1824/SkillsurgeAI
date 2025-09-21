import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon } from './Icons';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface SessionQuizProps {
    questions: QuizQuestion[];
    onComplete?: (score: number, total: number) => void;
}

export const SessionQuiz: React.FC<SessionQuizProps> = ({ questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
    const [showResults, setShowResults] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = answerIndex;
        setSelectedAnswers(newAnswers);
        setShowExplanation(false);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setShowResults(true);
            const score = selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
            onComplete?.(score, questions.length);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowExplanation(false);
        }
    };

    const handlePrevious = () => {
        if (!isFirstQuestion) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setShowExplanation(false);
        }
    };

    const handleShowExplanation = () => {
        setShowExplanation(true);
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'text-green-600 dark:text-green-400';
        if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreMessage = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'Excellent work! 🎉';
        if (percentage >= 60) return 'Good job! Keep it up! 💪';
        return 'Keep studying! You\'ll get there! 📚';
    };

    if (showResults) {
        const score = selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
        const percentage = (score / questions.length) * 100;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        percentage >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                        percentage >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-red-100 dark:bg-red-900/30'
                    }`}>
                        {percentage >= 80 ? (
                            <CheckCircleIcon className="w-10 h-10 text-green-500" />
                        ) : (
                            <XCircleIcon className="w-10 h-10 text-red-500" />
                        )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Quiz Complete!
                    </h3>
                    
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
                        {score}/{questions.length}
                    </div>
                    
                    <div className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                        {percentage.toFixed(1)}% Correct
                    </div>
                    
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6">
                        {getScoreMessage(score, questions.length)}
                    </p>

                    <div className="space-y-2 mb-6">
                        {questions.map((question, index) => {
                            const isCorrect = selectedAnswers[index] === question.correctAnswer;
                            return (
                                <div key={question.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Question {index + 1}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        {isCorrect ? (
                                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="w-5 h-5 text-red-500" />
                                        )}
                                        <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCorrect ? 'Correct' : 'Incorrect'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => {
                            setShowResults(false);
                            setCurrentQuestionIndex(0);
                            setSelectedAnswers(new Array(questions.length).fill(-1));
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Retake Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                    </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {currentQuestion.question}
                </h3>
                
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === index;
                        const isCorrect = index === currentQuestion.correctAnswer;
                        const showCorrect = showExplanation && isCorrect;
                        const showIncorrect = showExplanation && isSelected && !isCorrect;
                        
                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={showExplanation}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                                    showCorrect 
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                        : showIncorrect
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                        : isSelected
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500'
                                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                        showCorrect
                                            ? 'border-green-500 bg-green-500'
                                            : showIncorrect
                                            ? 'border-red-500 bg-red-500'
                                            : isSelected
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-slate-300 dark:border-slate-500'
                                    }`}>
                                        {showCorrect && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                        {showIncorrect && <XCircleIcon className="w-4 h-4 text-white" />}
                                        {!showExplanation && isSelected && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className={`font-medium ${
                                        showCorrect || showIncorrect
                                            ? 'text-slate-900 dark:text-white'
                                            : 'text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {option}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                        <LightBulbIcon className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Explanation
                            </h4>
                            <p className="text-blue-800 dark:text-blue-200">
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isFirstQuestion
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                    }`}
                >
                    Previous
                </button>

                <div className="flex space-x-3">
                    {selectedAnswers[currentQuestionIndex] !== -1 && !showExplanation && (
                        <button
                            onClick={handleShowExplanation}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-800 transition-all duration-300"
                        >
                            Show Explanation
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestionIndex] === -1}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedAnswers[currentQuestionIndex] === -1
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transform hover:scale-105 shadow-lg'
                        }`}
                    >
                        {isLastQuestion ? 'Finish Quiz' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};
