import express from "express";
import { body } from "express-validator";
import { getCurrentUser, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    validate,
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  loginUser
);

router.get("/me", protect, getCurrentUser);

export default router;
