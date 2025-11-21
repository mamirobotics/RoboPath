import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Roadmap, SkillCategory, Difficulty } from "../types";

// Initialize Gemini Client
// CRITICAL: API Key must come from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

// Define the schema for the roadmap generation
const roadmapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the career path" },
    summary: { type: Type.STRING, description: "A brief executive summary of this career path in robotics" },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { 
            type: Type.STRING, 
            enum: Object.values(SkillCategory) 
          },
          difficulty: { 
            type: Type.STRING, 
            enum: Object.values(Difficulty) 
          },
          description: { type: Type.STRING },
          importance: { type: Type.STRING, description: "Specific reason why this skill is needed for the user's interest" },
          resources: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "name", "category", "difficulty", "description", "importance", "resources"]
      }
    }
  },
  required: ["title", "summary", "skills"]
};

export const generateRoadmap = async (interest: string): Promise<Roadmap> => {
  const prompt = `
    I am a student of BS Intelligent Systems and Robotics.
    My specific area of interest is: "${interest}".
    
    Please generate a comprehensive skill roadmap for me. 
    Include a mix of foundational, core, and advanced skills across programming, hardware, math, and AI.
    Be specific (e.g., instead of just "Programming", say "C++ for Embedded Systems" or "Python for ML").
    Ensure the "importance" field explains EXACTLY why this skill helps with "${interest}".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        systemInstruction: "You are a world-class Robotics and AI Professor. You provide structured, actionable, and highly technical career advice."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Roadmap;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
};

export const askAssistant = async (history: {role: string, parts: {text: string}[]}[], question: string, context: Roadmap): Promise<string> => {
  // We inject the current roadmap context into the system instruction effectively by prepending it
  const contextString = `
    Current Roadmap Context: ${context.title}
    Summary: ${context.summary}
    Skills: ${context.skills.map(s => s.name).join(', ')}
  `;

  try {
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: `You are a helpful Robotics teaching assistant. Answer the student's questions based on the generated roadmap. Context: ${contextString}. Keep answers concise and encouraging.`
      },
      history: history
    });

    const response = await chat.sendMessage({ message: question });
    return response.text || "I couldn't generate an answer at this moment.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};