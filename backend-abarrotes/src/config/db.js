// src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Pool de conexiones MySQL.
 * Usa variables de entorno del archivo .env
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "abarrotes",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Función opcional para verificar rápidamente la conexión.
 * No es obligatorio usarla, pero es útil para un /healthcheck.
 */
export async function dbPing() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}
