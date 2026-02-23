export const protect = (req, res, next) => {
  console.log("protect",req.session.userId)
  if (req.session.userId == undefined) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  next();
};