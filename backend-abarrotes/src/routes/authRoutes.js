// src/routes/authRoutes.js
import { Router } from "express";
import { login } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// === Login ===
router.post("/login", login);

// === Ruta protegida de prueba ===
router.get("/check", verifyToken, (req, res) => {
  res.json({ message: "Token válido ✅", user: req.user });
});

export default router;
