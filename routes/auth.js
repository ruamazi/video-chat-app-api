import { Router } from "express";
import { onboard, signIn, signOut, signUp } from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/onboarding", protectRoute, onboard);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
 res.status(200).json(req.user);
});

export default router;
