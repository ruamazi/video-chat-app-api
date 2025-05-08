import { Router } from "express";
import {
 acceptFriendRequest,
 getFriendRequests,
 getFriends,
 getOutgoingRequests,
 getRecommendedUsers,
 sendFriendRequest,
} from "../controllers/user.js";
import { protectRoute } from "../middleware/auth.js";

const router = Router();

//apply middleware to all routes
router.use(protectRoute);

router.get("/recommended", getRecommendedUsers);
router.get("/friends", getFriends);
router.post("/add-friend/:id", sendFriendRequest);
router.put("/accept-friend/:id", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingRequests);

export default router;
