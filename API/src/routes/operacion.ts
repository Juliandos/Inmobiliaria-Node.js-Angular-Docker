import { Router } from "express";
import {
  getOperaciones,
  getOperacion,
  createOperacion,
  updateOperacion,
  deleteOperacion,
} from "../controllers/operacion";

const router = Router();

// Rutas CRUD para operaciones
router.get("/", getOperaciones);         // Leer todas
router.get("/:id", getOperacion);       // Leer una por ID
router.post("/", createOperacion);      // Crear
router.put("/:id", updateOperacion);    // Actualizar
router.delete("/:id", deleteOperacion); // Eliminar

export { router };

