import { Router } from "express";
import {
  getRolesPermisos,
  getRolPermiso,
  createRolPermiso,
  deleteRolPermiso,
} from "../controllers/rol-permiso";

const router = Router();

// Rutas CRUD para roles_permisos
router.get("/", getRolesPermisos);                        // Listar todas las relaciones
router.get("/:rol_id/:permiso_id", getRolPermiso);        // Obtener una relación específica
router.post("/", createRolPermiso);                       // Crear una nueva relación
router.delete("/:rol_id/:permiso_id", deleteRolPermiso);  // Eliminar una relación

export { router };
