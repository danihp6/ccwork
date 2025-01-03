import { Router } from "express";
import User from "../models/user";

const router = Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });

  try {
    await user.save();
    res.status(201).json({ message: "Registro de usario realizado con éxito" });
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error });
  }
});

export default router;
