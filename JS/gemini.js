import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export default async function Gemini() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Fala gemini, quanto é 43 + 43"
  });
  console.log(response.text);
  return response.text;
}

Gemini();