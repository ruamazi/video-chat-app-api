import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
 const curruentUser = req.user;
 try {
  const recommendedUsers = await User.find({
   $and: [
    { _id: { $ne: curruentUser._id } }, // Exclude the current user
    { _id: { $nin: curruentUser.friends } }, // Exclude users already in friends list
    { isOnBoarded: true },
   ],
  });
  res.status(200).json(recommendedUsers);
 } catch (error) {
  res.status(500).json({ error: "Internal server error" });
 }
};

export const getFriends = async (req, res) => {
 const curruentUser = req.user;
 try {
  const friends = await User.find({
   _id: { $in: curruentUser.friends },
  }).select("-password");
  res.status(200).json(friends);
 } catch (error) {
  res.status(500).json({ error: "Internal server error" });
 }
};

export const sendFriendRequest = async (req, res) => {
 const currentUserId = req.user._id;
 const friendId = req.params.id;
 if (currentUserId === friendId) {
  return res
   .status(400)
   .json({ error: "Cannot send friend request to yourself" });
 }
 try {
  const receiver = await User.findById(friendId);
  if (!receiver) {
   return res.status(404).json({ error: "Receiver not found" });
  }
  if (receiver.friends.includes(currentUserId)) {
   return res
    .status(400)
    .json({ error: "You are already friends with this user" });
  }
  const existingRequest = await FriendRequest.findOne({
   $or: [
    { sender: currentUserId, receiver: friendId },
    { sender: friendId, receiver: currentUserId },
   ],
  });
  if (existingRequest) {
   return res
    .status(400)
    .json({ error: "Friend request already exists between you and this user" });
  }
  const friendRequest = new FriendRequest({
   sender: currentUserId,
   receiver: friendId,
  });
  await friendRequest.save();
  res.status(201).json(friendRequest);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Internal server error" });
 }
};

export const acceptFriendRequest = async (req, res) => {
 const currentUserId = req.user._id;
 const friendRequestId = req.params.id;
 try {
  const friendRequest = await FriendRequest.findById(friendRequestId);
  if (!friendRequest) {
   return res.status(404).json({ error: "Friend request not found" });
  }
  if (friendRequest.receiver.toString() !== currentUserId.toString()) {
   return res
    .status(400)
    .json({ error: "You are not authorized to accept this friend request" });
  }
  friendRequest.status = "accepted";
  await friendRequest.save();
  await User.findByIdAndUpdate(friendRequest.sender, {
   $push: { friends: friendRequest.receiver },
  });
  await User.findByIdAndUpdate(friendRequest.receiver, {
   $push: { friends: friendRequest.sender },
  });
  //await friendRequest.deleteOne({ _id: friendRequest._id });

  res.status(200).json({ message: "Friend request accepted" });
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Internal server error" });
 }
};

export const getFriendRequests = async (req, res) => {
 const currentUserId = req.user._id;
 try {
  const incomingRequests = await FriendRequest.find({
   receiver: currentUserId,
   status: "pending",
  }).populate("sender", "username avatar nativeLanguage learningLanguage");

  const acceptedRequests = await FriendRequest.find({
   sender: currentUserId,
   status: "accepted",
  }).populate("receiver", "username avatar");

  res.status(200).json({ incomingRequests, acceptedRequests });
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Internal server error" });
 }
};

export const getOutgoingRequests = async (req, res) => {
 const currentUserId = req.user._id;
 try {
  const outgoingRequests = await FriendRequest.find({
   sender: currentUserId,
   status: "pending",
  }).populate("receiver", "username avatar nativeLanguage learningLanguage");
  res.status(200).json(outgoingRequests);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Internal server error" });
 }
};
