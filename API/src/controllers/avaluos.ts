import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { uploadToS3 } from "../utils/s3";

/**
 * Subir documento de la ciudad (POT, normativas, etc.)
 * POST /api/avaluos/documentos-ciudad
 */
const uploadDocumentoCiudad = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion } = req.body;
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ 
        success: false,
        message: "No se recibió ningún archivo" 
      });
    }

    // Validar que sea PDF
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ 
        success: false,
        message: "Solo se permiten archivos PDF" 
      });
    }

    // Validar tamaño (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        success: false,
        message: "El archivo excede el tamaño máximo de 50MB" 
      });
    }

    // Generar nombre del archivo
    const fileName = nombre 
      ? `${nombre.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      : file.originalname;

    // Subir a S3 en la carpeta documentos-ciudad
    const url = await uploadToS3(
      file.buffer,
      fileName,
      "documentos-ciudad"
    );

    return res.status(201).json({
      success: true,
      message: "Documento subido correctamente",
      data: {
        url,
        nombre: nombre || fileName,
        descripcion: descripcion || null,
        fecha_subida: new Date().toISOString(),
        tipo: "documento_ciudad"
      }
    });
  } catch (e: any) {
    console.error("ERROR_UPLOAD_DOCUMENTO_CIUDAD", e);
    return handleHttp(res, "ERROR_UPLOAD_DOCUMENTO_CIUDAD", e);
  }
};

/**
 * Subir documento de propiedad (escritura, certificado, etc.)
 * POST /api/avaluos/propiedades/:propiedadId/documentos
 */
const uploadDocumentoPropiedad = async (req: Request, res: Response) => {
  try {
    const { propiedadId } = req.params;
    const { tipo, descripcion } = req.body;
    const file = req.file as Express.Multer.File;

    if (!propiedadId) {
      return res.status(400).json({ 
        success: false,
        message: "Falta el ID de la propiedad" 
      });
    }

    if (!file) {
      return res.status(400).json({ 
        success: false,
        message: "No se recibió ningún archivo" 
      });
    }

    // Validar que sea PDF
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ 
        success: false,
        message: "Solo se permiten archivos PDF" 
      });
    }

    // Validar tamaño (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        success: false,
        message: "El archivo excede el tamaño máximo de 50MB" 
      });
    }

    // Validar tipo de documento
    const tiposValidos = ['escritura', 'certificado_tradicion', 'recibo_energia', 'otros'];
    const tipoDocumento = tipo || 'otros';
    
    if (!tiposValidos.includes(tipoDocumento)) {
      return res.status(400).json({ 
        success: false,
        message: `Tipo de documento inválido. Tipos válidos: ${tiposValidos.join(', ')}` 
      });
    }

    // Generar nombre del archivo
    const fileName = `${tipoDocumento}_${Date.now()}.pdf`;

    // Subir a S3 en la carpeta documentos-propiedad/{propiedadId}
    const url = await uploadToS3(
      file.buffer,
      fileName,
      `documentos-propiedad/${propiedadId}`
    );

    return res.status(201).json({
      success: true,
      message: "Documento subido correctamente",
      data: {
        url,
        tipo: tipoDocumento,
        propiedad_id: parseInt(propiedadId),
        descripcion: descripcion || null,
        fecha_subida: new Date().toISOString()
      }
    });
  } catch (e: any) {
    console.error("ERROR_UPLOAD_DOCUMENTO_PROPIEDAD", e);
    return handleHttp(res, "ERROR_UPLOAD_DOCUMENTO_PROPIEDAD", e);
  }
};

/**
 * Listar documentos de la ciudad
 * GET /api/avaluos/documentos-ciudad
 */
const getDocumentosCiudad = async (req: Request, res: Response) => {
  try {
    // Por ahora retornamos un array vacío
    // En el futuro se puede implementar listado desde S3 o DB
    return res.json({
      success: true,
      data: [],
      message: "Listado de documentos de ciudad (pendiente de implementar)"
    });
  } catch (e: any) {
    console.error("ERROR_GET_DOCUMENTOS_CIUDAD", e);
    return handleHttp(res, "ERROR_GET_DOCUMENTOS_CIUDAD", e);
  }
};

/**
 * Listar documentos de una propiedad
 * GET /api/avaluos/propiedades/:propiedadId/documentos
 */
const getDocumentosPropiedad = async (req: Request, res: Response) => {
  try {
    const { propiedadId } = req.params;
    
    if (!propiedadId) {
      return res.status(400).json({ 
        success: false,
        message: "Falta el ID de la propiedad" 
      });
    }

    // Por ahora retornamos un array vacío
    // En el futuro se puede implementar listado desde S3 o DB
    return res.json({
      success: true,
      data: [],
      propiedad_id: parseInt(propiedadId),
      message: "Listado de documentos de propiedad (pendiente de implementar)"
    });
  } catch (e: any) {
    console.error("ERROR_GET_DOCUMENTOS_PROPIEDAD", e);
    return handleHttp(res, "ERROR_GET_DOCUMENTOS_PROPIEDAD", e);
  }
};

export {
  uploadDocumentoCiudad,
  uploadDocumentoPropiedad,
  getDocumentosCiudad,
  getDocumentosPropiedad,
};

