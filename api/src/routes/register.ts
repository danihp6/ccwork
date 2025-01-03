import { Router } from "express";
import Function from "../models/function";

const router = Router();

router.post("/", async (req, res) => {
  const { username, image } = req.body;
  const newFunction = new Function({ username, image });
  try {
    await newFunction.save();
    res.status(201).json({ message: "Registro creado con éxito" });
  } catch (error) {
    res.status(400).json({ message: "Error al crear el registro", error });
  }
});

export default router;
