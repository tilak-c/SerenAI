import mongoose from "mongoose";

const emotionSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    unique: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  messageCount: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("Emotion", emotionSchema);