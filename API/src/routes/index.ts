import { Router } from "express";
import { readdirSync } from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { verifyToken } from "../middleware/auth";

// Obtener el equivalente de __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATH_ROUTER = `${__dirname}`;
const router = Router();

// Middleware global con excepción
router.use((req, res, next) => {
  if (req.path.startsWith("/auth")) {
    // Deja pasar libremente las rutas de auth
    return next();
  }
  // Para las demás, exige token
  return verifyToken(req, res, next);
});

const cleanFileName = (fileName: string) => {
  const file = fileName.split(".").shift();
  return file;
};

readdirSync(PATH_ROUTER).filter((fileName) => {
  const cleanName = cleanFileName(fileName);
  if (cleanName !== "index") {
    import(`./${cleanName}`).then((moduleRouter) => {
      router.use(`/${cleanName}`, moduleRouter.router);
    });
  }
});

export { router };