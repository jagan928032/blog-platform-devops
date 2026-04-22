import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = await Comment.create({
    content,
    author: req.user._id,
    post: post._id,
  });

  const populatedComment = await Comment.findById(comment._id).populate("author", "name email role");
  res.status(201).json(populatedComment);
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const isOwner = comment.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not allowed to edit this comment");
  }

  comment.content = req.body.content ?? comment.content;
  await comment.save();

  const updatedComment = await Comment.findById(comment._id).populate("author", "name email role");
  res.json(updatedComment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const isOwner = comment.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not allowed to delete this comment");
  }

  await comment.deleteOne();
  res.json({ message: "Comment deleted successfully" });
});
