import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import helmet from "helmet";

const app = express();

app.use(
 cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
 })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

let isConnected;
const connectToDB = async () => {
 if (isConnected) return;
 try {
  const db = await mongoose.connect(process.env.MONGO_URI, {
   dbName: "your-db-name",
  });
  isConnected = db.connections[0].readyState;
  console.log("MongoDB connected");
 } catch (err) {
  console.error("MongoDB connection error", err);
  throw err;
 }
};
connectToDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
 res.json({ message: "Video Calling Realtime Chat App API" });
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
 console.log(`Server running on port:${port}`);
});
