// src/app.js
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorHandler } from "./middlewares/errorHandler.js";
// Importa el pool desde la configuración de base de datos
import { pool } from "./config/db.js";

// Rutas (las iremos agregando poco a poco)
import authRoutes from "./routes/authRoutes.js";
import productosRoutes from "./routes/productosRoutes.js";

const app = express();

// === Middleware globales ===
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static("uploads")); // para servir imágenes

// === Ruta raíz de prueba ===
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API de Abarrotes funcionando correctamente",
    endpoints: ["/api/auth/test", "/api/productos/test"]
  });
});

// ========================
// 💚 Ruta de salud DB
// ========================
app.get("/api/health/db", async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    res.json({ db: "ok" });
  } catch (err) {
    next(err);
  }
});


// === Rutas principales ===
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);

// === Manejador global de errores ===
app.use(errorHandler);

export default app;
