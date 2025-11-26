import { Request, Response } from "express";
import { models } from "../db/database"; // Asegúrate de exportar los modelos desde database.ts
import { handleHttp } from "../utils/error.handle";

// ✅ Obtener todas las propiedades con usuario, tipo y operación
const getPropiedades = async (req: Request, res: Response) => {
  try {
    const propiedades = await models.propiedades.findAll({
      include: [
        { model: models.usuarios, as: "usuario" },
        { model: models.tipos_propiedad, as: "tipo" },
        { model: models.operacion, as: "operacion" },
        { model: models.imagenes_propiedad, as: "imagenes_propiedads" },
      ],
    });
    
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

// ✅ Crear una propiedad
const createPropiedad = async (req: Request, res: Response) => {
  try {
    const propiedad = await models.propiedades.create(req.body);
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

// ✅ Actualizar una propiedad por ID
const updatePropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await models.propiedades.update(req.body, {
      where: { id },
    });
    if (!updated)
      return res.status(404).json({ message: "Propiedad no encontrada" });
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

// ✅ Eliminar una propiedad por ID
const deletePropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await models.propiedades.destroy({ where: { id } });
    if (!deleted)
      return res.status(404).json({ message: "Propiedad no encontrada" });
    return res.json({ message: "Propiedad eliminada" });
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
