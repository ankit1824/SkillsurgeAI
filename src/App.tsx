import React, { useState, useCallback } from 'react';
import { CourseInputForm } from './components/CourseInputForm';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { CourseDisplay } from './components/CourseDisplay';
import { SessionView } from './components/SessionView';
import { LoadingIcon } from './components/Icons';
import {
  AppStep,
  CourseParams,
  AssessmentQuestion,
  Course,
  SessionDetails,
  ActiveSessionContext,
  LearningStyle,
} from './types';
import {
  generateAssessmentQuestions,
  determineLearningStyle,
  generateCourse,
  generateSessionDetails,
} from './services/geminiService';

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center">
    <div className="relative">
      <LoadingIcon className="w-16 h-16 text-gradient-primary mx-auto animate-spin mb-4" />
      <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
    </div>
    <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">{message}</p>
    <p className="text-slate-500 dark:text-slate-400">Our AI is crafting your learning experience...</p>
    <div className="mt-4 flex justify-center space-x-1">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ message: string; onReset: () => void }> = ({ message, onReset }) => (
    <div className="w-full max-w-lg text-center">
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-3xl p-8 border border-red-200 dark:border-red-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Oops! Something went wrong</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{message}</p>
            <button
                onClick={onReset}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Start Over
            </button>
        </div>
    </div>
);

function App() {
  const [appStep, setAppStep] = useState<AppStep>(AppStep.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [courseParams, setCourseParams] = useState<CourseParams | null>(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeSessionContext, setActiveSessionContext] = useState<ActiveSessionContext | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = useCallback(() => {
    setAppStep(AppStep.INPUT);
    setCourseParams(null);
    setAssessmentQuestions([]);
    setCourse(null);
    setActiveSessionContext(null);
    setSessionDetails(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleCourseParamsSubmit = async (params: CourseParams) => {
    if (isLoading) return;
    setIsLoading(true);
    setCourseParams(params);
    setAppStep(AppStep.GENERATING_ASSESSMENT);
    try {
      const questions = await generateAssessmentQuestions(params.topic);
      setAssessmentQuestions(questions);
      setAppStep(AppStep.ASSESSMENT);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred while generating assessment.");
      setAppStep(AppStep.ERROR);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAssessmentSubmit = async (answers: string[]) => {
    if (isLoading || !courseParams) {
        setError("Course parameters are missing. Please start over.");
        setAppStep(AppStep.ERROR);
        return;
    }
    setIsLoading(true);
    setAppStep(AppStep.GENERATING_COURSE);
    try {
        const style = await determineLearningStyle(answers);
        const generatedCourse = await generateCourse(courseParams, style);
        setCourse(generatedCourse);
        setAppStep(AppStep.COURSE_VIEW);
    } catch (e: any) {
        setError(e.message || "An unknown error occurred while generating the course.");
        setAppStep(AppStep.ERROR);
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartSession = async (context: ActiveSessionContext) => {
    if (isLoading) return;
    setIsLoading(true);
    setActiveSessionContext(context);
    setAppStep(AppStep.GENERATING_SESSION);
    try {
        const details = await generateSessionDetails(context);
        setSessionDetails(details);
        setAppStep(AppStep.SESSION_VIEW);
    } catch (e: any) {
        setError(e.message || "An unknown error occurred while generating session details.");
        setAppStep(AppStep.ERROR);
    } finally {
        setIsLoading(false);
    }
  };

  const handleBackToCourse = () => {
    setAppStep(AppStep.COURSE_VIEW);
    setSessionDetails(null);
    setActiveSessionContext(null);
  };

  const renderContent = () => {
    switch (appStep) {
      case AppStep.INPUT:
        return <CourseInputForm onSubmit={handleCourseParamsSubmit} isLoading={isLoading} />;
      case AppStep.GENERATING_ASSESSMENT:
        return <LoadingIndicator message="Generating Learning Style Assessment..." />;
      case AppStep.ASSESSMENT:
        return <AssessmentQuiz questions={assessmentQuestions} onSubmit={handleAssessmentSubmit} />;
      case AppStep.GENERATING_COURSE:
        return <LoadingIndicator message={`Analyzing your style and building your course on ${courseParams?.topic}...`} />;
      case AppStep.COURSE_VIEW:
        if (!course) return <ErrorDisplay message="Course data is missing." onReset={handleReset} />;
        return <CourseDisplay course={course} onReset={handleReset} onStartSession={handleStartSession} />;
      case AppStep.GENERATING_SESSION:
        return <LoadingIndicator message={`Preparing your session: ${activeSessionContext?.sessionTitle}...`} />;
      case AppStep.SESSION_VIEW:
        if (!sessionDetails || !activeSessionContext) return <ErrorDisplay message="Session data is missing." onReset={handleReset} />;
        return <SessionView sessionDetails={sessionDetails} sessionTitle={activeSessionContext.sessionTitle} onBack={handleBackToCourse} />;
      case AppStep.ERROR:
        return <ErrorDisplay message={error || "An unknown error occurred."} onReset={handleReset} />;
      default:
        return <ErrorDisplay message="Invalid application state." onReset={handleReset} />;
    }
  };

  return (
    <main className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-500">
        <div className="animate-fade-in-up w-full max-w-7xl">{renderContent()}</div>
    </main>
  );
}

export default App;
