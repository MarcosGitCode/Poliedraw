import { GoogleGenAI } from "@google/genai";
import "dotenv/config";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function Gemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    let textParts = [];
    let imageParts = [];

      
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        textParts.push(part.text);
      }
      if (part.inlineData) {  
        const base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        imageParts.push(base64Image);
      }
      }

      return {
        text: textParts.join('\n'),
        images: imageParts
      };
  } catch (error) {
    console.error('Erro no Gemini:', error);
    throw error;
  }
}