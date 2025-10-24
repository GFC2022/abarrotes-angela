// src/controllers/authController.js
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";


dotenv.config();

export const login = async (req, res, next) => {
  try {
    console.log("🟢 Login solicitado:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      console.log("❌ Faltan credenciales");
      return res.status(400).json({ error: "Usuario y contraseña requeridos" });
    }

    console.log("🔍 Buscando usuario en base de datos...");

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ? AND estatus_id = 1",
      [username]
    );

    console.log("Resultado SQL:", rows);

    if (rows.length === 0) {
      console.log("❌ Usuario no encontrado");
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });
    }

    const user = rows[0];
    console.log("✅ Usuario encontrado:", user.username);

    console.log("🧮 Comparando contraseña...");
    const valid = await bcrypt.compare(password, user.password_hash);

    console.log("Resultado bcrypt:", valid);

    if (!valid) {
      console.log("❌ Contraseña incorrecta");
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    console.log("🔐 Generando tokens...");
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, tienda_id: user.tienda_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );

    console.log("✅ Login exitoso, enviando respuesta...");
    res.json({
      message: "Login exitoso",
      accessToken,
      refreshToken,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        username: user.username,
        tienda_id: user.tienda_id,
      },
    });
  } catch (error) {
    console.error("💥 Error en login:", error);
    res.status(500).json({ error: "Error interno en login" });
  }
};
