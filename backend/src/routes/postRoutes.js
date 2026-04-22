import express from "express";
import { body } from "express-validator";
import {
  createPost,
  deletePost,
  getMyPosts,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/mine", protect, getMyPosts);
router.get("/:id", getPostById);

router.post(
  "/",
  protect,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Content must be at least 10 characters long"),
    body("imageUrl")
      .optional({ values: "falsy" })
      .isURL({ protocols: ["http", "https"], require_protocol: true })
      .withMessage("Image URL must be a valid http or https link"),
    validate,
  ],
  createPost
);

router.put(
  "/:id",
  protect,
  [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("content")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Content must be at least 10 characters long"),
    body("imageUrl")
      .optional({ values: "falsy" })
      .isURL({ protocols: ["http", "https"], require_protocol: true })
      .withMessage("Image URL must be a valid http or https link"),
    validate,
  ],
  updatePost
);

router.delete("/:id", protect, deletePost);

export default router;
