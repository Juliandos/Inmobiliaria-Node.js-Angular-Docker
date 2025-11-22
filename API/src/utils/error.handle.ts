import { Response } from "express";

const handleHttp = (res: Response, error: string, errorRaw?: any) => {
  console.error(`❌ ${error}:`, errorRaw);
  res.status(500);
  res.send({ 
    error,
    message: errorRaw?.message || 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? errorRaw : undefined
  });
};

export { handleHttp };
