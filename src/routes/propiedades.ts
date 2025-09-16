import { Router } from "express";
import {
  getPropiedades,
  getPropiedad,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
} from "../controllers/propiedades";

const router = Router();

// Rutas CRUD
router.get("/", getPropiedades); // Leer todas
router.get("/:id", getPropiedad); // Leer una por ID
router.post("/", createPropiedad); // Crear
router.put("/:id", updatePropiedad); // Actualizar
router.delete("/:id", deletePropiedad); // Borrar

export { router };
