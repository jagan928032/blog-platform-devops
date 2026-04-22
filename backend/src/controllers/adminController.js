import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await Comment.deleteMany({ author: user._id });

  const posts = await Post.find({ author: user._id }).select("_id");
  const postIds = posts.map((post) => post._id);
  if (postIds.length > 0) {
    await Comment.deleteMany({ post: { $in: postIds } });
  }
  await Post.deleteMany({ author: user._id });
  await user.deleteOne();

  res.json({ message: "User deleted successfully" });
});

export const adminDeletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.json({ message: "Post deleted by admin" });
});
