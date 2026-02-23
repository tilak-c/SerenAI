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
router.get("/", getAllChats);
router.get("/:id",getChatById);
router.delete("/:id", deleteChat);

export default router;