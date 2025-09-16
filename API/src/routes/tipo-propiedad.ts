import { Router } from "express";
import {
  getTiposPropiedad,
  getTipoPropiedad,
  createTipoPropiedad,
  updateTipoPropiedad,
  deleteTipoPropiedad,
} from "../controllers/tipo-propiedad";

const router = Router();

// Rutas CRUD para tipos de propiedad
router.get("/", getTiposPropiedad);         // Leer todos
router.get("/:id", getTipoPropiedad);       // Leer uno por ID
router.post("/", createTipoPropiedad);      // Crear
router.put("/:id", updateTipoPropiedad);    // Actualizar
router.delete("/:id", deleteTipoPropiedad); // Eliminar

export { router };
