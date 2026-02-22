export const protect = (req, res, next) => {
  console.log("protect",req.session)
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  next();
};