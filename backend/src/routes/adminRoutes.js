import express from "express";
import { adminDeletePost, deleteUser, getUsers } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.delete("/posts/:id", adminDeletePost);

export default router;
