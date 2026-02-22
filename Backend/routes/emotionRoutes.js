import express from "express";
import {
  getEmotionTrend,
  getHeatmapData
} from "../controllers/emotionController.js";
const router = express.Router();

router.get("/",getEmotionTrend);
router.get("/heatmap", getHeatmapData);

export default router;