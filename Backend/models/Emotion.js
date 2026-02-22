import mongoose from "mongoose";

const emotionSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true
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
  },user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
});

export default mongoose.model("Emotion", emotionSchema);