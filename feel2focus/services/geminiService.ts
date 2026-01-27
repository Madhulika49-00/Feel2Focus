
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, StudyPlan, CompletedSession, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStudyPlan(goal: string, mood: Mood, availableTime: number): Promise<StudyPlan> {
  const prompt = `Act as a senior education mentor. Generate a dynamic study plan for a student.
  Primary Goal: ${goal}
  Current Energy/Mood: ${mood}
  Available Study Time: ${availableTime} minutes
  
  Adapt the plan based on energy:
  - High energy: Longer deep focus sessions, complex topics.
  - Low energy/Stressed: Shorter Pomodoro-style sessions, revisions, or light reading.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          motivation: { type: Type.STRING },
          sessions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'Unique string ID' },
                topic: { type: Type.STRING },
                duration: { type: Type.NUMBER },
                type: { type: Type.STRING, enum: ['focus', 'break', 'revision', 'practice'] }
              },
              required: ['id', 'topic', 'duration', 'type']
            }
          }
        },
        required: ['title', 'motivation', 'sessions']
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateDailyInsights(history: CompletedSession[], goal: string) {
  const prompt = `Review the following study history for the goal "${goal}" and provide a short, 2-sentence encouraging insight or tip for tomorrow.
  History: ${JSON.stringify(history.map(h => ({ topic: h.topic, duration: h.duration })))}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export async function chatWithAI(history: ChatMessage[], newMessage: ChatMessage) {
  const contents = history.map(h => ({
    role: h.role,
    parts: h.parts
  }));

  // Add the new message to contents
  contents.push({
    role: 'user',
    parts: newMessage.parts
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: 'You are Feel2Focus Bot, a supportive, exam-oriented doubt solver for students. Explain concepts simply and suggest examples/tricks. You can analyze images and documents provided by the user.',
    },
  });

  return response.text;
}
