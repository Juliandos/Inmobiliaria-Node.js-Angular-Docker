import { Request, Response } from "express";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";
import cloudinary from "../utils/cloudinary";

// ✅ Obtener todas las imágenes con la propiedad asociada
const getImagenesPropiedad = async (req: Request, res: Response) => {
  try {
    const imagenes = await models.imagenes_propiedad.findAll({
      include: [
        { model: models.propiedades, as: "propiedad" },
      ],
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
    console.log("Files recibidos:", req.files);

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
      // Subir a Cloudinary usando buffer
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "propiedades" }, (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
          })
          .end(file.buffer);
      });

      urls.push(result.secure_url);

      // Guarda en DB cada imagen
      await models.imagenes_propiedad.create({
        propiedad_id,
        url: result.secure_url,
      });
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
    const [updated] = await models.imagenes_propiedad.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Imagen no encontrada" });
    const imagen = await models.imagenes_propiedad.findByPk(id, {
      include: [{ model: models.propiedades, as: "propiedad" }],
    });
    return res.json(imagen?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_IMAGEN", e);
  }
};

// ✅ Eliminar una imagen por ID
const deleteImagenPropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await models.imagenes_propiedad.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Imagen no encontrada" });
    return res.json({ message: "Imagen eliminada" });
  } catch (e) {
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
