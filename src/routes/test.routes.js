import express from "express";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Authentication working",
    user: req.user,
  });
});

export default router;
