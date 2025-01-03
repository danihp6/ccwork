import { Router } from "express";
import Function from "../models/function";
import { getUserFromJWT } from "../middlewares/GetUserFromJWT";

const router = Router();

router.post("/", getUserFromJWT, async (req, res) => {
  const { image } = req.body;
  const newFunction = new Function({ username: req.params.user, image });
  try {
    await newFunction.save();
    res.status(201).json({ message: "Registro creado con éxito" });
  } catch (error) {
    res.status(400).json({ message: "Error al crear el registro", error });
  }
});

export default router;
