import express from "express";
import { body } from "express-validator";
import { addComment, deleteComment, updateComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/post/:postId",
  protect,
  [body("content").trim().notEmpty().withMessage("Comment content is required"), validate],
  addComment
);

router.put(
  "/:id",
  protect,
  [body("content").trim().notEmpty().withMessage("Comment content is required"), validate],
  updateComment
);

router.delete("/:id", protect, deleteComment);

export default router;
