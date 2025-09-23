import { Router } from "express";
import {
  getPermisos,
  getPermiso,
  createPermiso,
  updatePermiso,
  deletePermiso,
  getPermisosByRol,
  getPermisosByModulo,
} from "../controllers/permisos";

const router = Router();

// ✅ RUTAS ESPECÍFICAS (DEBEN IR ANTES DE LAS RUTAS GENERALES)
router.get("/rol/:rol_id", getPermisosByRol);
router.get("/modulo/:modulo_id", getPermisosByModulo);

// ✅ RUTAS GENERALES CRUD
router.get("/", getPermisos);           // GET /permisos
router.get("/:id", getPermiso);         // GET /permisos/:id
router.post("/", createPermiso);        // POST /permisos
router.put("/:id", updatePermiso);      // PUT /permisos/:id
router.delete("/:id", deletePermiso);   // DELETE /permisos/:id

export { router };