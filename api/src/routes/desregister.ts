import { Router } from "express";
import Function from "../models/function";
import { getUserFromJWT } from "../middlewares/GetUserFromJWT";

const router = Router();

router.post("/", getUserFromJWT, async (req, res) => {
  const { image } = req.body;
  try {
    const result = await Function.deleteOne({
      username: req.params.user,
      image: image,
    });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Registro no encontrado" });
      return;
    }
    res.status(200).json({ message: "Registro eliminado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar el registro",
        error: JSON.stringify(error),
      });
  }
});

export default router;
