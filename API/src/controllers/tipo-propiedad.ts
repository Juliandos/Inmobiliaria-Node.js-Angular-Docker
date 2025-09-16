import { Request, Response } from "express";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";

// ✅ Obtener todos los tipos de propiedad con sus propiedades asociadas
const getTiposPropiedad = async (req: Request, res: Response) => {
  try {
    const tipos = await models.tipos_propiedad.findAll({
      include: [{ model: models.propiedades, as: "propiedades" }],
    });
    return res.json(tipos.map((t) => t.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_TIPOS_PROPIEDAD", e);
  }
};

// ✅ Obtener un tipo de propiedad por ID
const getTipoPropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tipo = await models.tipos_propiedad.findByPk(id, {
      include: [{ model: models.propiedades, as: "propiedades" }],
    });
    if (!tipo) return res.status(404).json({ message: "Tipo de propiedad no encontrado" });
    return res.json(tipo.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_TIPO_PROPIEDAD", e);
  }
};

// ✅ Crear un tipo de propiedad
const createTipoPropiedad = async (req: Request, res: Response) => {
  try {
    const tipo = await models.tipos_propiedad.create(req.body);
    return res.status(201).json(tipo.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_TIPO_PROPIEDAD", e);
  }
};

// ✅ Actualizar un tipo de propiedad por ID
const updateTipoPropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await models.tipos_propiedad.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Tipo de propiedad no encontrado" });
    const tipo = await models.tipos_propiedad.findByPk(id, {
      include: [{ model: models.propiedades, as: "propiedades" }],
    });
    return res.json(tipo?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_TIPO_PROPIEDAD", e);
  }
};

// ✅ Eliminar un tipo de propiedad por ID
const deleteTipoPropiedad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await models.tipos_propiedad.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Tipo de propiedad no encontrado" });
    return res.json({ message: "Tipo de propiedad eliminado" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_TIPO_PROPIEDAD", e);
  }
};

export {
  getTiposPropiedad,
  getTipoPropiedad,
  createTipoPropiedad,
  updateTipoPropiedad,
  deleteTipoPropiedad,
};
