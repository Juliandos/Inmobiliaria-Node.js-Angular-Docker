import { Router } from "express";
import {
  getRoles,
  getRol,
  createRol,
  updateRol,
  deleteRol
} from "../controllers/roles";

const router = Router();

// Leer todos los roles
router.get("/", getRoles);

// Leer un rol por ID
router.get("/:id", getRol);

// Crear nuevo rol
router.post("/", createRol);

// Actualizar rol por ID
router.put("/:id", updateRol);

// Eliminar rol por ID
router.delete("/:id", deleteRol);

export { router };
