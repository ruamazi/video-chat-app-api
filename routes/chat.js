import { Router } from "express";
import { getStreamToken } from "../controllers/chat.js";
import { protectRoute } from "../middleware/auth.js";

const router = Router();

router.get("/token", protectRoute, getStreamToken);

export default router;
