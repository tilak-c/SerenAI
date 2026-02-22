import express from "express";
import {
  sendMessage,
  getAllChats,
  getChatById,
  deleteChat
}
from "../controllers/chatController.js";
import { protect } from "../middleware/protect.js";
const router = express.Router();

router.post("/", sendMessage);
router.get("/", protect, getAllChats);
router.get("/:id", protect, getChatById);
router.delete("/:id", protect, deleteChat);

export default router;