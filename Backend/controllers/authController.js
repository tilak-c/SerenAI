import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });
    console.log(user._id)
    req.session.userId = user._id;
    
req.session.save(err => {

  if (err) {
    return res.status(500).json({ message: "Session save failed" });
  }

  res.json({
    message: "Registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });

});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }
    console.log(user._id)
    req.session.userId = user._id;
req.session.save(err => {

  if (err) {
    return res.status(500).json({ message: "Session save failed" });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });

});


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
};

export const checkAuth = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated"
    });
  }

  res.json({ authenticated: true });
};

// Debug helper: returns minimal info about incoming cookies and session.
// Use this only for debugging; do not expose in production without protecting it.
export const debugSession = (req, res) => {
  try {
    const cookieHeader = req.headers.cookie || null;
    const sessionId = req.sessionID || null;
    const hasUser = !!req.session?.userId;

    res.json({
      cookieHeader,
      sessionId,
      hasUser,
      userId: req.session?.userId || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};