import React, { useState } from 'react';
import { Course, LearningStyle, Module, Lesson, Session, ActiveSessionContext } from '../types';
import { LayersIcon, BookOpenIcon, CheckSquareIcon, ChevronDownIcon, EyeIcon, EarIcon, HandIcon, FileTextIcon } from './Icons';

const getLearningStyleIcon = (style: LearningStyle) => {
    switch (style) {
        case LearningStyle.Visual: return <EyeIcon className="w-5 h-5" />;
        case LearningStyle.Auditory: return <EarIcon className="w-5 h-5" />;
        case LearningStyle.Kinesthetic: return <HandIcon className="w-5 h-5" />;
        case LearningStyle.ReadingWriting: return <FileTextIcon className="w-5 h-5" />;
        default: return null;
    }
};

const SessionItem: React.FC<{ session: Session, index: number, onStart: () => void }> = ({ session, index, onStart }) => (
    <div className="ml-8 pl-6 border-l-2 border-sky-200 dark:border-sky-800 py-4">
        <div className="flex items-center space-x-3 mb-2">
            <div className="bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full h-8 w-8 flex items-center justify-center font-bold">
                {index + 1}
            </div>
            <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">{session.title}</h4>
        </div>
        <p className="text-slate-600 dark:text-slate-400 prose prose-sm max-w-none mb-4">{session.content}</p>
        <button
             onClick={onStart}
             className="bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all duration-200 transform hover:scale-105"
        >
            Start Session
        </button>
    </div>
);

const LessonItem: React.FC<{ lesson: Lesson, index: number, onStartSession: (lessonTitle: string, sessionTitle: string) => void }> = ({ lesson, index, onStartSession }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="ml-4 pl-6 border-l-2 border-teal-200 dark:border-teal-800">
            <div onClick={() => setIsOpen(!isOpen)} className="py-4 cursor-pointer flex justify-between items-center group">
                <div className="flex items-center space-x-3">
                    <CheckSquareIcon className="w-6 h-6 text-teal-500" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        Lesson {index + 1}: {lesson.title}
                    </h3>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="pb-4">
                    {lesson.sessions?.map((session, i) => (
                        <SessionItem 
                            key={i} 
                            session={session} 
                            index={i} 
                            onStart={() => onStartSession(lesson.title, session.title)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ModuleItem: React.FC<{ module: Module, index: number, onStartSession: (moduleTitle: string, lessonTitle: string, sessionTitle: string) => void }> = ({ module, index, onStartSession }) => {
    const [isOpen, setIsOpen] = useState(index === 0);
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-6 overflow-hidden">
            <div onClick={() => setIsOpen(!isOpen)} className="p-6 cursor-pointer flex justify-between items-center group bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                    <BookOpenIcon className="w-8 h-8 text-sky-500" />
                    <div>
                        <p className="text-sm font-medium text-sky-600 dark:text-sky-400">Module {index + 1}</p>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{module.title}</h2>
                    </div>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="p-6">
                    {module.lessons?.map((lesson, i) => (
                        <LessonItem 
                            key={i} 
                            lesson={lesson} 
                            index={i} 
                            onStartSession={(lessonTitle, sessionTitle) => onStartSession(module.title, lessonTitle, sessionTitle)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


export const CourseDisplay: React.FC<{ course: Course, onReset: () => void, onStartSession: (context: ActiveSessionContext) => void }> = ({ course, onReset, onStartSession }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8 mb-8 text-center">
                <LayersIcon className="w-16 h-16 text-sky-500 mx-auto mb-4"/>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{course.title}</h1>
                <div className="mt-4 inline-flex items-center space-x-2 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 text-sm font-medium px-4 py-1 rounded-full">
                    {getLearningStyleIcon(course.learningStyle)}
                    <span>Personalized for: <strong>{course.learningStyle}</strong> Learner</span>
                </div>
            </div>
            
            <div>
                {course.modules?.map((module, i) => (
                    <ModuleItem 
                        key={i} 
                        module={module} 
                        index={i}
                        onStartSession={(moduleTitle, lessonTitle, sessionTitle) => 
                            onStartSession({
                                courseTitle: course.title,
                                learningStyle: course.learningStyle,
                                moduleTitle,
                                lessonTitle,
                                sessionTitle,
                            })
                        }
                    />
                ))}
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={onReset}
                    className="bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-800 transition-all duration-300"
                >
                    Create Another Course
                </button>
            </div>
        </div>
    );
};