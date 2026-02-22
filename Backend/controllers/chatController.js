import Chat from "../models/Chat.js";
import Emotion from "../models/Emotion.js";
import {
  generateChatReply,
  analyzeSentimentFromChat
} from "../services/geminiService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);
    }

    if (!chat) {
      chat = await Chat.create({ messages: [] });
    }

    chat.messages.push({
      role: "user",
      content: message
    });

    const sentimentScore = await analyzeSentimentFromChat(message);

    const today = new Date().toISOString().split("T")[0];

    let emotion = await Emotion.findOne({ date: today });

    if (!emotion) {
      emotion = await Emotion.create({
        date: today,
        totalScore: sentimentScore,
        messageCount: 1,
        averageScore: sentimentScore
      });
    } else {
      emotion.totalScore += sentimentScore;
      emotion.messageCount += 1;
      emotion.averageScore =
        emotion.totalScore / emotion.messageCount;
      await emotion.save();
    }

    const reply = await generateChatReply(chat.messages);

    chat.messages.push({
      role: "assistant",
      content: reply
    });

    await chat.save();

    res.json(chat);

  } catch (error) {
  console.error("SEND MESSAGE ERROR:");
  console.error(error);
  res.status(500).json({ message: error.message });
}
};

export const getAllChats = async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 });
  res.json(chats);
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    res.json(chat);
  } catch (error) {
  console.error("SEND MESSAGE ERROR:");
  console.error(error);
  res.status(500).json({ message: error.message });
}
};

export const deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
  console.error("SEND MESSAGE ERROR:");
  console.error(error);
  res.status(500).json({ message: error.message });
}
};