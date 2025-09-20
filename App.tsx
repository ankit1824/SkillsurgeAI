

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
    <LoadingIcon className="w-16 h-16 text-sky-500 mx-auto animate-spin mb-4" />
    <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">{message}</p>
    <p className="text-slate-500 dark:text-slate-400 mt-2">Our AI is crafting your learning experience...</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string; onReset: () => void }> = ({ message, onReset }) => (
    <div className="w-full max-w-lg text-center">
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">An Error Occurred</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{message}</p>
            <button
                onClick={onReset}
                className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-colors"
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
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500">
        <div className="animate-fade-in-up">{renderContent()}</div>
    </main>
  );
}

export default App;