import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal server error";

  if (statusCode === 500) {
    console.error("[unhandled error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
