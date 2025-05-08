import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
 res.json({ message: "Video Calling Realtime Chat App API" });
});

app.listen(port, () => {
 connectDB();
 console.log(`Server running at http://localhost:${port}`);
});
