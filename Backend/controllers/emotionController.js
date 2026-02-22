import Emotion from "../models/Emotion.js";

export const getEmotionTrend = async (req, res) => {
  try {
    const emotions = await Emotion.find().sort({ date: 1 });
    res.json(emotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHeatmapData = async (req, res) => {
  try {
    const emotions = await Emotion.find();

    const formatted = emotions.map(e => ({
      date: e.date,
      intensity: Math.round(e.averageScore)
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};