import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import helmet from "helmet";

const port = process.env.PORT || 3030;
const app = express();
app.use(helmet());
app.use(
 cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
 })
);
app.use(express.json());
app.use(cookieParser());

mongoose
 .connect(process.env.MONGO_URI)
 .then(() => console.log("MongoDB Connected"))
 .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
 res.json({ message: "Video Calling Realtime Chat App API" });
});

app.listen(port, () => {
 console.log(`Server running on port:${port}`);
});
