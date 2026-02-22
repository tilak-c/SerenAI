import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    default: "New Chat"
  },

  messages: [messageSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }

});


export default mongoose.model("Chat", chatSchema);