import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import bcrypt from "bcrypt";

const router = Router();

const JWT_KEY = process.env.JWT_KEY || "jwt-key";
const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Usuario no existe" });
    }

    const match = await bcrypt.compare(password, user!.password);
    if (!match) {
      res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        key: JWT_KEY,
        username: user!.username,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({
      message: "Error en el inicio de sesión",
      error: JSON.stringify(error),
    });
  }
});

export default router;
