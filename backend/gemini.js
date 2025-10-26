import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function Gemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ]
  });
  console.log(response.text);
  return response.text;
}