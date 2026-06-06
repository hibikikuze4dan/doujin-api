import { type Request, type Response, type NextFunction } from "express";
import { getUserConfigs } from "../utils";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req?.headers?.["authorization"];
  const token = authHeader && authHeader?.split?.(" ")?.[1];

  const userConfig = await getUserConfigs();

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (token !== userConfig.auth_token) {
    return res.status(403).json({ error: "Invalid token" });
  }

  next();
};
