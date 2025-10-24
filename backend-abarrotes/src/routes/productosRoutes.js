// src/routes/productosRoutes.js
import { Router } from "express";
const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "Ruta /api/productos/test funcionando correctamente 🛒" });
});

export default router;
