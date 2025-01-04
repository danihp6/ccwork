import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret";

// Middleware para verificar si el usuario existe
export const getUserFromJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.params.user = decoded.username;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado", error });
  }
};
