import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { exit } from "process";

// Middleware para verificar si el usuario existe
export const getUserFromJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.params.user = decoded as string;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado", error });
  }
};
