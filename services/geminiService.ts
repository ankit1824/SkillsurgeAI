// Fix: Implement Gemini API calls to generate course content.
import { GoogleGenAI, Type } from "@google/genai";
import { CourseParams, LearningStyle, AssessmentQuestion, Course, SessionDetails, ActiveSessionContext } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = "gemini-2.5-flash";

// Helper function to parse JSON from AI response, handling markdown code blocks
const parseJsonResponse = <T>(text: string): T => {
    try {
        const jsonString = text.trim().replace(/^```json\s*/, '').replace(/```$/, '');
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error("Failed to parse JSON:", text, error);
        throw new Error("The AI returned an invalid response format. Please try again.");
    }
};

export const generateAssessmentQuestions = async (topic: string): Promise<AssessmentQuestion[]> => {
    const prompt = `Generate 5 multiple-choice questions to determine a user's preferred learning style (Visual, Auditory, Kinesthetic, Reading/Writing) in the context of learning about "${topic}". Each question should have 4 options, each corresponding to one of the learning styles.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                }
                            },
                            required: ["question", "options"]
                        }
                    }
                },
                required: ["questions"]
            }
        }
    });

    const result = parseJsonResponse<{ questions: AssessmentQuestion[] }>(response.text);
    if (!result.questions || result.questions.length === 0) {
        throw new Error("Could not generate assessment questions.");
    }
    return result.questions;
};

export const determineLearningStyle = async (answers: string[]): Promise<LearningStyle> => {
    const prompt = `Based on these answers to a learning style questionnaire, determine the user's primary learning style. The options were designed to correspond to Visual, Auditory, Kinesthetic, and Reading/Writing styles. Tally the answers and determine the dominant style. The answers are: ${answers.join(", ")}. Return only one of these values: "Visual", "Auditory", "Kinesthetic", "Reading/Writing".`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    
    const style = response.text.trim();

    const validStyles: string[] = Object.values(LearningStyle);
    if (validStyles.includes(style)) {
        return style as LearningStyle;
    }

    // Fallback parsing for cases where the model response is not an exact match
    for (const validStyle of validStyles) {
        if (style.toLowerCase().includes(validStyle.toLowerCase().split('/')[0])) {
            return validStyle as LearningStyle;
        }
    }
    
    return LearningStyle.Visual; // Default fallback
};

export const generateCourse = async (params: CourseParams, learningStyle: LearningStyle): Promise<Course> => {
    const prompt = `Create a detailed course curriculum on the topic of "${params.topic}".
    The course should be ${params.durationInWeeks} weeks long and tailored for a ${params.difficulty} level learner.
    The curriculum MUST be personalized for a "${learningStyle}" learning style.
    The output should be a JSON object.
    The course structure should be:
    - A main "title" for the course.
    - The identified "learningStyle".
    - A list of "modules", where each module represents a week.
    - Each module should have a "title".
    - Each module should contain a list of "lessons".
    - Each lesson should have a "title".
    - Each lesson should contain a list of "sessions".
    - Each session should have a "title" and a brief "content" description (1-2 sentences) of what the session covers, tailored to the learning style.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    learningStyle: { type: Type.STRING, enum: Object.values(LearningStyle) },
                    modules: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                lessons: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING },
                                            sessions: {
                                                type: Type.ARRAY,
                                                items: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        title: { type: Type.STRING },
                                                        content: { type: Type.STRING }
                                                    },
                                                    required: ["title", "content"]
                                                }
                                            }
                                        },
                                        required: ["title", "sessions"]
                                    }
                                }
                            },
                            required: ["title", "lessons"]
                        }
                    }
                },
                required: ["title", "learningStyle", "modules"]
            }
        }
    });

    return parseJsonResponse<Course>(response.text);
};


export const generateSessionDetails = async (context: ActiveSessionContext): Promise<SessionDetails> => {
    const prompt = `Generate the content for a single learning session.
    Course: "${context.courseTitle}"
    Module: "${context.moduleTitle}"
    Lesson: "${context.lessonTitle}"
    Session: "${context.sessionTitle}"
    The content MUST be tailored for a "${context.learningStyle}" learner.
    
    The output must be a JSON object with the following structure:
    - "keyConcepts": An array of strings, listing the most important concepts.
    - "learningObjective": A string describing what the learner should be able to do after this session.
    - "sessionContent": A detailed, multi-paragraph explanation of the topic, written for the specified learning style. Use markdown for formatting (e.g., headings, bold text, lists).
    - "activity": An object with a "title" and a "description" of a practical activity to reinforce learning, tailored to the learning style.
    - "mindMap": A hierarchical object representing a mind map of the session's key concepts. It should have a "name" (the session title) and an array of "children" nodes, which can also have children.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    learningObjective: { type: Type.STRING },
                    sessionContent: { type: Type.STRING },
                    activity: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ["title", "description"]
                    },
                    mindMap: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            children: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        children: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    name: { type: Type.STRING }
                                                }
                                            }
                                        }
                                    },
                                    required: ["name"]
                                }
                            }
                        },
                        required: ["name"]
                    }
                },
                required: ["keyConcepts", "learningObjective", "sessionContent", "activity", "mindMap"]
            }
        }
    });

    return parseJsonResponse<SessionDetails>(response.text);
};
