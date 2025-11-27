import { Request, Response } from "express";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";
import { uploadToS3, deleteFromS3, isS3Url } from "../utils/s3";

// ✅ Obtener todas las imágenes con la propiedad asociada
const getImagenesPropiedad = async (req: Request, res: Response) => {
  try {
    const imagenes = await models.imagenes_propiedad.findAll({
      include: [{ model: models.propiedades, as: "propiedad" }],
    });
    return res.json(imagenes.map((img) => img.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_IMAGENES", e);
  }
};

// ✅ Obtener una imagen por ID
const getImagenPropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const imagen = await models.imagenes_propiedad.findByPk(id, {
      include: [{ model: models.propiedades, as: "propiedad" }],
    });
    if (!imagen) return res.status(404).json({ message: "Imagen no encontrada" });
    return res.json(imagen.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_IMAGEN", e);
  }
};

// ✅ Crear una nueva imagen para una propiedad
const createImagenPropiedad = async (req: Request, res: Response) => {
  try {
    const propiedad_id = req.body.propiedad_id;
    if (!propiedad_id) {
      return res.status(400).json({ message: "Falta propiedad_id" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No se recibieron imágenes" });
    }

    const urls: string[] = [];

    for (const file of files) {
      try {
        const url = await uploadToS3(file.buffer, file.originalname, "propiedades");
        urls.push(url);

        await models.imagenes_propiedad.create({
          propiedad_id,
          url: url,
        });
      } catch (uploadError) {
        console.error("Error subiendo imagen a S3:", uploadError);
        // Continuar con las siguientes imágenes aunque falle una
      }
    }

    return res.status(201).json({ urls });
  } catch (e: any) {
    console.error("ERROR_CREATE_IMAGEN", e);
    return handleHttp(res, "ERROR_CREATE_IMAGEN", e);
  }
};

// ✅ Actualizar una imagen por ID
const updateImagenPropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const imagenExistente = await models.imagenes_propiedad.findByPk(id);
    if (!imagenExistente) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    let updateData: any = {};

    if (req.body.propiedad_id) {
      updateData.propiedad_id = req.body.propiedad_id;
    }

    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      if (imagenExistente.url && isS3Url(imagenExistente.url)) {
        try {
          await deleteFromS3(imagenExistente.url);
        } catch (deleteError) {
          console.error("Error eliminando imagen anterior de S3:", deleteError);
        }
      }

      const file = files[0];
      try {
        const url = await uploadToS3(file.buffer, file.originalname, "propiedades");
        updateData.url = url;
      } catch (uploadError) {
        console.error("Error subiendo imagen a S3:", uploadError);
        throw uploadError;
      }
    }

    if (req.body.url && !files?.length) {
      if (imagenExistente.url && isS3Url(imagenExistente.url)) {
        try {
          await deleteFromS3(imagenExistente.url);
        } catch (deleteError) {
          console.error("Error eliminando imagen anterior de S3:", deleteError);
        }
      }
      updateData.url = req.body.url;
    }

    const [updated] = await models.imagenes_propiedad.update(updateData, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ message: "No se pudo actualizar la imagen" });
    }

    const imagen = await models.imagenes_propiedad.findByPk(id, {
      include: [{ model: models.propiedades, as: "propiedad" }],
    });

    return res.json(imagen?.toJSON());
  } catch (e) {
    console.error("ERROR_UPDATE_IMAGEN", e);
    handleHttp(res, "ERROR_UPDATE_IMAGEN", e);
  }
};

// ✅ Eliminar una imagen por ID
const deleteImagenPropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const imagen = await models.imagenes_propiedad.findByPk(id);
    if (!imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    if (imagen.url && isS3Url(imagen.url)) {
      try {
        await deleteFromS3(imagen.url);
      } catch (s3Error) {
        console.error("Error eliminando de S3:", s3Error);
      }
    }

    const deleted = await models.imagenes_propiedad.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "No se pudo eliminar la imagen" });
    }

    return res.json({ message: "Imagen eliminada exitosamente" });
  } catch (e) {
    console.error("ERROR_DELETE_IMAGEN", e);
    handleHttp(res, "ERROR_DELETE_IMAGEN", e);
  }
};

export {
  getImagenesPropiedad,
  getImagenPropiedad,
  createImagenPropiedad,
  updateImagenPropiedad,
  deleteImagenPropiedad,
};
