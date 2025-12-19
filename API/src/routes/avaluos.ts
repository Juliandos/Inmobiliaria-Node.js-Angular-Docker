import { Router } from "express";
import upload from "../middleware/upload";
import {
  uploadDocumentoCiudad,
  uploadDocumentoPropiedad,
  getDocumentosCiudad,
  getDocumentosPropiedad,
} from "../controllers/avaluos";

const router = Router();

// ============================================
// RUTAS PARA DOCUMENTOS DE CIUDAD
// ============================================
// Listar documentos de ciudad
router.get("/documentos-ciudad", getDocumentosCiudad);

// Subir documento de ciudad (POT, normativas, etc.)
router.post(
  "/documentos-ciudad",
  upload.single("file"), // Un solo archivo PDF
  uploadDocumentoCiudad
);

// ============================================
// RUTAS PARA DOCUMENTOS DE PROPIEDAD
// ============================================
// Listar documentos de una propiedad
router.get("/propiedades/:propiedadId/documentos", getDocumentosPropiedad);

// Subir documento de propiedad (escritura, certificado, etc.)
router.post(
  "/propiedades/:propiedadId/documentos",
  upload.single("file"), // Un solo archivo PDF
  uploadDocumentoPropiedad
);

export { router };

