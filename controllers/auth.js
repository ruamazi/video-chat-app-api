import { generateAvatar } from "../lib/generateAvatar.js";
import { upsertStreamUser } from "../lib/stream.js";
import {
 validateEmail,
 validatePassword,
 validateUsername,
} from "../lib/validations.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
 const { email, password, username } = req.body;
 if (!email || !password || !username) {
  return res.status(400).json({ error: "Missing fields" });
 }
 const emailValid = validateEmail(email);
 if (!emailValid.valid) {
  return res.status(400).json({ error: emailValid.error });
 }
 const usernameValid = validateUsername(username);
 if (!usernameValid.valid) {
  return res.status(400).json({ error: usernameValid.error });
 }
 const passwordValid = validatePassword(password);
 if (!passwordValid.valid) {
  return res.status(400).json({ error: passwordValid.error });
 }
 try {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
   return res.status(400).json({ error: "You are already registered" });
  }
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
   return res.status(400).json({ error: "Username is already taken" });
  }
  const randomAvatar = generateAvatar(username);
  const user = new User({
   email,
   password,
   username,
   avatar: randomAvatar,
  });
  await user.save();

  try {
   await upsertStreamUser({
    id: user._id.toString(),
    name: user.username,
    image: user.avatar || "",
   });
  } catch (error) {
   console.log("failed to create stream user", error);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
   expiresIn: "7d",
  });
  res.cookie("videoCallChatToken", token, {
   httpOnly: true,
   maxAge: 7 * 24 * 60 * 60 * 1000,
   secure: process.env.NODE_ENV === "production",
   sameSite: "none",
  });
  const { password: _, ...userWithoutPassword } = user._doc;
  res.status(201).json(userWithoutPassword);
 } catch (error) {
  console.log(error);
  res.json({ error: "Internal server error" });
 }
};

export const signIn = async (req, res) => {
 const { email, password } = req.body;
 try {
  if (!email || !password) {
   return res.status(400).json({ error: "Missing fields" });
  }
  const user = await User.findOne({ email });
  if (!user) {
   return res.status(401).json({ error: "Invalid email or password" });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
   return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
   expiresIn: "7d",
  });
  res.cookie("videoCallChatToken", token, {
   httpOnly: true,
   maxAge: 7 * 24 * 60 * 60 * 1000,
   secure: process.env.NODE_ENV === "production",
   sameSite: "none",
  });
  const { password: _, ...userWithoutPassword } = user._doc;
  res.status(200).json(userWithoutPassword);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Internal server error" });
 }
};

export const signOut = async (req, res) => {
 res.clearCookie("videoCallChatToken");
 res.status(200).json({ message: "Signed out successfully" });
};

export const onboard = async (req, res) => {
 const userId = req.user._id;
 const { username, bio, learningLanguage, nativeLanguage, location, avatar } =
  req.body;
 const usernameValid = validateUsername(username);
 if (!usernameValid.valid) {
  return res.status(400).json({ error: usernameValid.error });
 }
 if (
  !username ||
  !learningLanguage ||
  !location ||
  !bio ||
  !nativeLanguage ||
  !avatar
 ) {
  return res.status(400).json({
   error: "Missing fields",
   missingFields: [
    !username && "username",
    !learningLanguage && "learningLanguage",
    !location && "location",
    !bio && "bio",
    !nativeLanguage && "nativeLanguage",
    !avatar && "avatar",
   ].filter(Boolean),
  });
 }
 try {
  const updatedUser = await User.findByIdAndUpdate(
   userId,
   {
    username,
    bio,
    nativeLanguage,
    learningLanguage,
    location,
    avatar,
    isOnBoarded: true,
   },
   { new: true }
  );
  if (!updatedUser) {
   return res.status(404).json({ error: "User not found" });
  }

  try {
   await upsertStreamUser({
    id: updatedUser._id.toString(),
    name: updatedUser.username,
    image: updatedUser.avatar || "",
   });
  } catch (error) {
   console.log("failed to create stream user", error);
  }

  res.status(200).json(updatedUser);
 } catch (error) {
  console.log("Onboarding error", error);
  res.status(500).json({ error: "Internal server error" });
 }
};
