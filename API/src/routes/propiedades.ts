import { Router } from "express";
import {
  getPropiedades,
  getPropiedad,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
} from "../controllers/propiedades";
import upload from "../middleware/upload";

const router = Router();

// Rutas CRUD
router.get("/", getPropiedades); // Leer todas
router.get("/:id", getPropiedad); // Leer una por ID
router.post("/", upload.array("imagenes", 10), createPropiedad); // Crear con imágenes opcionales
router.put("/:id", upload.array("imagenes", 10), updatePropiedad); // Actualizar con imágenes opcionales
router.delete("/:id", deletePropiedad); // Borrar (elimina imágenes de Cloudinary automáticamente)

export { router };
