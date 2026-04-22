import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const getPosts = asyncHandler(async (_req, res) => {
  const posts = await Post.find()
    .populate("author", "name email role")
    .sort({ createdAt: -1 });

  res.json(posts);
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name email role");

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comments = await Comment.find({ post: post._id })
    .populate("author", "name email role")
    .sort({ createdAt: -1 });

  res.json({ ...post.toObject(), comments });
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, imageUrl } = req.body;

  const post = await Post.create({
    title,
    content,
    imageUrl: imageUrl?.trim() || "",
    author: req.user._id,
  });

  const populatedPost = await Post.findById(post._id).populate("author", "name email role");
  res.status(201).json(populatedPost);
});

export const updatePost = asyncHandler(async (req, res) => {
  const { title, content, imageUrl } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not allowed to edit this post");
  }

  post.title = title ?? post.title;
  post.content = content ?? post.content;
  if (imageUrl !== undefined) {
    post.imageUrl = imageUrl.trim();
  }
  await post.save();

  const updatedPost = await Post.findById(post._id).populate("author", "name email role");
  res.json(updatedPost);
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not allowed to delete this post");
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.json({ message: "Post deleted successfully" });
});

export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate("author", "name email role")
    .sort({ createdAt: -1 });

  res.json(posts);
});

export const getAllPostsForAdmin = asyncHandler(async (_req, res) => {
  const posts = await Post.find()
    .populate("author", "name email role")
    .sort({ createdAt: -1 });

  res.json(posts);
});
