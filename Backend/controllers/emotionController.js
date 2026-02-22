import Emotion from "../models/Emotion.js";

export const getEmotionTrend = async (req, res) => {
  try {
    if(!req.session.userId){
      return res.status(200).json({
        message:"Not authorized",
        data:[]
      })
    }
    const userId=req.session.userId
    const emotions = await Emotion.find({user:userId}).sort({ date: 1 });
    if(emotions.length===0){
      return res.status(200).json({
        message:"Start chatting to get the data",
        data:[]
      })
    }
    res.json(emotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHeatmapData = async (req, res) => {
  try {
    if(!req.session.userId){
      return res.status(200).json({
        message:"Start chatting to get the data",
        data:[]
      })
    }
     const userId=req.session.userId
     console.log("Hheatmap",userId)
    const emotions = await Emotion.find({user:userId});
    if(!emotions || emotions.length===0){
       return res.status(200).json({
        message:"Start chatting to get the data",
        data:[]
      })
    }

    const formatted = emotions.map(e => ({
      date: e.date,
      intensity: Math.round(e.averageScore)
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};