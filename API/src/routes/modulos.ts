// src/routes/modulos.ts
import { Router } from "express";
import {
  getModulos,
  getModulo,
  createModulo,
  updateModulo,
  deleteModulo,
} from "../controllers/modulos";

const router = Router();

// ✅ RUTAS CRUD PARA MÓDULOS
router.get("/", getModulos);         // GET /modulos - Obtener todos los módulos
router.get("/:id", getModulo);       // GET /modulos/:id - Obtener módulo por ID
router.post("/", createModulo);      // POST /modulos - Crear nuevo módulo
router.put("/:id", updateModulo);    // PUT /modulos/:id - Actualizar módulo
router.delete("/:id", deleteModulo); // DELETE /modulos/:id - Eliminar módulo

export { router };