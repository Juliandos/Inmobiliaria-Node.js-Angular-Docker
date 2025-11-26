import { Request, Response } from "express";
import { models } from "../db/database"; // Asegúrate de exportar los modelos desde database.ts
import { handleHttp } from "../utils/error.handle";
import cloudinary from "../utils/cloudinary";

// ✅ Obtener todas las propiedades con usuario, tipo y operación
// Soporta query params: operacion_id (filtrar por operación) y limit (limitar resultados)
const getPropiedades = async (req: Request, res: Response) => {
  try {
    const { operacion_id, limit } = req.query;
    
    // Construir el objeto de consulta
    const queryOptions: any = {
      include: [
        { model: models.usuarios, as: "usuario" },
        { model: models.tipos_propiedad, as: "tipo" },
        { model: models.operacion, as: "operacion" },
        { model: models.imagenes_propiedad, as: "imagenes_propiedads" },
      ],
    };

    // Filtrar por operacion_id si se proporciona
    if (operacion_id) {
      queryOptions.where = {
        operacion_id: parseInt(operacion_id as string)
      };
    }

    // Limitar resultados si se proporciona limit
    if (limit) {
      queryOptions.limit = parseInt(limit as string);
    }
    
    const propiedades = await models.propiedades.findAll(queryOptions);
    
    return res.json(propiedades.map((p) => p.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_PROPIEDADES", e);
  }
};

// ✅ Obtener una propiedad por ID
const getPropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const propiedad = await models.propiedades.findByPk(id, {
      include: [
        { model: models.usuarios, as: "usuario" },
        { model: models.tipos_propiedad, as: "tipo" },
        { model: models.operacion, as: "operacion" },
        { model: models.imagenes_propiedad, as: "imagenes_propiedads" },
      ],
    });
    if (!propiedad)
      return res.status(404).json({ message: "Propiedad no encontrada" });
    return res.json(propiedad.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_PROPIEDAD", e);
  }
};

// ✅ Crear una propiedad con imágenes opcionales
const createPropiedad = async (req: Request, res: Response) => {
  try {
    // Crear la propiedad primero
    const propiedad = await models.propiedades.create(req.body);
    
    // Si hay imágenes, subirlas a Cloudinary
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "propiedades" }, (error, uploadResult) => {
                if (error) return reject(error);
                resolve(uploadResult);
              })
              .end(file.buffer);
          });

          // Guardar la URL de la imagen en la base de datos
          await models.imagenes_propiedad.create({
            propiedad_id: propiedad.id,
            url: result.secure_url,
          });
        } catch (imageError) {
          console.error("Error subiendo imagen a Cloudinary:", imageError);
          // Continuar aunque falle una imagen
        }
      }
    }

    // Obtener la propiedad creada con sus relaciones
    const propiedadWithRelations = await models.propiedades.findByPk(propiedad.id, {
      include: [
        { model: models.usuarios, as: "usuario" },
        { model: models.tipos_propiedad, as: "tipo" },
        { model: models.operacion, as: "operacion" },
        { model: models.imagenes_propiedad, as: "imagenes_propiedads" },
      ],
    });
    return res.status(201).json(propiedadWithRelations?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_PROPIEDAD", e);
  }
};

// ✅ Actualizar una propiedad por ID con imágenes opcionales
const updatePropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar que la propiedad existe
    const propiedadExistente = await models.propiedades.findByPk(id, {
      include: [{ model: models.imagenes_propiedad, as: "imagenes_propiedads" }],
    });
    
    if (!propiedadExistente) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    // Actualizar los datos de la propiedad (excluyendo imágenes)
    const { imagenes_a_eliminar, ...propiedadData } = req.body;
    
    // Si hay IDs de imágenes a eliminar
    if (imagenes_a_eliminar && Array.isArray(imagenes_a_eliminar)) {
      for (const imagenId of imagenes_a_eliminar) {
        const imagen = await models.imagenes_propiedad.findByPk(imagenId);
        if (imagen && imagen.propiedad_id === parseInt(id)) {
          // Eliminar de Cloudinary si existe
          if (imagen.url && imagen.url.includes("cloudinary")) {
            try {
              const urlParts = imagen.url.split("/");
              const publicIdWithExtension = urlParts[urlParts.length - 1];
              const publicId = `propiedades/${publicIdWithExtension.split(".")[0]}`;
              await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
              console.error("Error eliminando imagen de Cloudinary:", deleteError);
            }
          }
          // Eliminar de la base de datos
          await models.imagenes_propiedad.destroy({ where: { id: imagenId } });
        }
      }
    }

    // Actualizar los datos de la propiedad
    const [updated] = await models.propiedades.update(propiedadData, {
      where: { id },
    });

    // Si hay nuevas imágenes, subirlas a Cloudinary
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "propiedades" }, (error, uploadResult) => {
                if (error) return reject(error);
                resolve(uploadResult);
              })
              .end(file.buffer);
          });

          // Guardar la URL de la imagen en la base de datos
          await models.imagenes_propiedad.create({
            propiedad_id: parseInt(id),
            url: result.secure_url,
          });
        } catch (imageError) {
          console.error("Error subiendo imagen a Cloudinary:", imageError);
          // Continuar aunque falle una imagen
        }
      }
    }

    // Obtener la propiedad actualizada con sus relaciones
    const propiedad = await models.propiedades.findByPk(id, {
      include: [
        { model: models.usuarios, as: "usuario" },
        { model: models.tipos_propiedad, as: "tipo" },
        { model: models.operacion, as: "operacion" },
        { model: models.imagenes_propiedad, as: "imagenes_propiedads" },
      ],
    });
    return res.json(propiedad?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_PROPIEDAD", e);
  }
};

// ✅ Eliminar una propiedad por ID y sus imágenes de Cloudinary
const deletePropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Obtener la propiedad con sus imágenes antes de eliminar
    const propiedad = await models.propiedades.findByPk(id, {
      include: [{ model: models.imagenes_propiedad, as: "imagenes_propiedads" }],
    });
    
    if (!propiedad) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    // Eliminar todas las imágenes de Cloudinary antes de eliminar la propiedad
    if (propiedad.imagenes_propiedads && propiedad.imagenes_propiedads.length > 0) {
      for (const imagen of propiedad.imagenes_propiedads) {
        const imagenData = imagen.toJSON();
        if (imagenData.url && imagenData.url.includes("cloudinary")) {
          try {
            const urlParts = imagenData.url.split("/");
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `propiedades/${publicIdWithExtension.split(".")[0]}`;
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryError) {
            console.error("Error eliminando imagen de Cloudinary:", cloudinaryError);
            // Continuar aunque falle eliminar una imagen
          }
        }
      }
    }

    // Eliminar la propiedad (esto también eliminará las imágenes por cascade si está configurado)
    const deleted = await models.propiedades.destroy({ where: { id } });
    
    if (!deleted) {
      return res.status(404).json({ message: "No se pudo eliminar la propiedad" });
    }
    
    return res.json({ message: "Propiedad y sus imágenes eliminadas exitosamente" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_PROPIEDAD", e);
  }
};

export {
  getPropiedades,
  getPropiedad,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
};
