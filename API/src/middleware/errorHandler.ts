// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    mensaje: err.message || 'Error interno del servidor'
  });
}
