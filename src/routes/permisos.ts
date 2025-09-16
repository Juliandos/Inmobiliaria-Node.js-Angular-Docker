import { Router } from "express";
import {
  getPermisos,
  getPermiso,
  createPermiso,
  updatePermiso,
  deletePermiso,
} from "../controllers/permisos";

const router = Router();

// Rutas CRUD para permisos
router.get("/", getPermisos);        // Leer todos
router.get("/:id", getPermiso);      // Leer uno por ID
router.post("/", createPermiso);     // Crear
router.put("/:id", updatePermiso);   // Actualizar
router.delete("/:id", deletePermiso);// Eliminar

export { router };
