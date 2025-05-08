import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
 console.log(req.cookies);

 const token = req.cookies.videoCallChatToken;
 if (!token) {
  return res.status(401).json({ error: "Not authorized, no token" });
 }
 try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
   return res.status(401).json({ error: "Not authorized, Invalid token" });
  }
  const user = await User.findById(decoded.userId).select("-password");
  req.user = user;
  next();
 } catch (error) {
  console.log("Error in protectRoute", error);
  res.status(401).json({ error: "Not authorized" });
 }
};
