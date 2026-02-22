import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export const analyzeSentimentFromChat = async (text) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Rate the emotional tone of this message from 1 to 10.

1 = extremely negative
5 = neutral
10 = extremely positive

Return ONLY a number.

Message:
${text}
`
  });

  const raw = response.text.trim();

  const score = parseFloat(raw);

  if (isNaN(score)) return 5;

  return Math.max(1, Math.min(10, score));
};
export const generateChatReply = async (conversation) => {
  const formattedMessages = conversation.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: formattedMessages
  });

  return response.text;
};