import Chat from "../models/Chat.js";
import Emotion from "../models/Emotion.js";
import mongoose from "mongoose";
import {
  generateChatReply,
  analyzeSentimentFromChat
} from "../services/geminiService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.session.userId;
    console.log("Send Message",req.session)
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: userId });
    }

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        title: message.substring(0, 30),
        messages: []
      });
    }

    chat.messages.push({ role: "user", content: message });

    const rawScore = await analyzeSentimentFromChat(message);
    const sentimentScore = isNaN(parseFloat(rawScore)) ? 5 : parseFloat(rawScore);
    
    console.log("SENTIMENT SCORE:", sentimentScore);
    console.log("USER ID:", userId);

    const today = new Date().toISOString().split("T")[0];
    console.log("TODAY:", today);

    let emotion = await Emotion.findOne({
      user: new mongoose.Types.ObjectId(userId),
      date: today
    });
    console.log("EXISTING EMOTION:", emotion);

    if (!emotion) {
      try {
        emotion = await Emotion.create({
          user: new mongoose.Types.ObjectId(userId),
          date: today,
          totalScore: sentimentScore,
          messageCount: 1,
          averageScore: sentimentScore
        });
        console.log("EMOTION CREATED:", emotion);
      } catch (emotionErr) {
        console.error("EMOTION CREATE ERROR:", emotionErr);
      }
    } else {
      emotion.totalScore += sentimentScore;
      emotion.messageCount += 1;
      emotion.averageScore = emotion.totalScore / emotion.messageCount;
      await emotion.save();
    }

    const reply = await generateChatReply(chat.messages);
    chat.messages.push({ role: "assistant", content: reply });
    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log("Get All Chats",req.session);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const chats = await Chat.find({ user: userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const userId = req.session.userId;
    const chat = await Chat.findOne({ _id: req.params.id, user: userId });
    console.log("Get chat by Id",req.session);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const userId = req.session.userId;
    await Chat.findOneAndDelete({ _id: req.params.id, user: userId });
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};