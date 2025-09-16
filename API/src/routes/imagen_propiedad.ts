import { Router } from "express";
import {
  getImagenesPropiedad,
  getImagenPropiedad,
  createImagenPropiedad,
  updateImagenPropiedad,
  deleteImagenPropiedad,
} from "../controllers/imagen-propiedad";

const router = Router();

// Rutas CRUD para imágenes de propiedad
router.get("/", getImagenesPropiedad);         // Listar todas
router.get("/:id", getImagenPropiedad);        // Obtener una por ID
router.post("/", createImagenPropiedad);       // Crear
router.put("/:id", updateImagenPropiedad);     // Actualizar
router.delete("/:id", deleteImagenPropiedad);  // Eliminar

export { router };
