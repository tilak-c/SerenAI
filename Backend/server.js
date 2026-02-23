import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import chatRoutes from "./routes/chatRoutes.js";
import emotionRoutes from "./routes/emotionRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
const app = express();

app.set("trust proxy", 1);  

const allowedOrigins = [
  "http://localhost:5173",
  "https://seren-ai-vshy.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    }
    else {
      callback(new Error("Not allowed by CORS"));
    }

  },
  credentials: true
}));

app.use(express.json());

app.use(session({
  name:"connect.sid",
  secret: process.env.SESSION_SECRET,

  resave: false,
  saveUninitialized: false,

  proxy: true, 

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),

  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/emotions", emotionRoutes);

app.listen(5005, () => {
  console.log("Server running on port 5005");
});