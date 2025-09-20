// Fix: Define all necessary types and enums for the application.
export enum AppStep {
  INPUT,
  GENERATING_ASSESSMENT,
  ASSESSMENT,
  GENERATING_COURSE,
  COURSE_VIEW,
  GENERATING_SESSION,
  SESSION_VIEW,
  ERROR,
}

export enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert",
}

export enum LearningStyle {
  Visual = "Visual",
  Auditory = "Auditory",
  Kinesthetic = "Kinesthetic",
  ReadingWriting = "Reading/Writing",
}

export interface CourseParams {
  topic: string;
  durationInWeeks: number;
  difficulty: Difficulty;
}

export interface AssessmentQuestion {
  question: string;
  options: string[];
}

export interface Session {
  title: string;
  content: string;
}

export interface Lesson {
  title: string;
  sessions: Session[];
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  title: string;
  learningStyle: LearningStyle;
  modules: Module[];
}

export interface ActiveSessionContext {
  courseTitle: string;
  learningStyle: LearningStyle;
  moduleTitle: string;
  lessonTitle: string;
  sessionTitle: string;
}

export interface MindMapNode {
    name: string;
    children?: MindMapNode[];
}

export interface SessionDetails {
    keyConcepts: string[];
    learningObjective: string;
    sessionContent: string;
    activity: {
        title: string;
        description: string;
    };
    mindMap: MindMapNode;
}
