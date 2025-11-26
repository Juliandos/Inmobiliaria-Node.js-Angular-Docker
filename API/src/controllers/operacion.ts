import { Request, Response } from "express";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";

// ✅ Obtener todas las operaciones con sus propiedades asociadas
const getOperaciones = async (req: Request, res: Response) => {
  try {
    const operaciones = await models.operacion.findAll({
      include: [{ model: models.propiedades, as: "propiedades" }],
    });
    return res.json(operaciones.map((o) => o.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_OPERACIONES", e);
  }
};

// ✅ Obtener una operación por ID
const getOperacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const operacion = await models.operacion.findByPk(id, {
      include: [{ model: models.propiedades, as: "propiedades" }],
    });
    if (!operacion) return res.status(404).json({ message: "Operación no encontrada" });
    return res.json(operacion.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_OPERACION", e);
  }
};

// ✅ Crear una operación
const createOperacion = async (req: Request, res: Response) => {
  try {
    const operacion = await models.operacion.create(req.body);
    return res.status(201).json(operacion.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_OPERACION", e);
  }
};

// ✅ Actualizar una operación por ID
const updateOperacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await models.operacion.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Operación no encontrada" });
    const operacion = await models.operacion.findByPk(id, {
      include: [{ model: models.propiedades, as: "propiedades" }],
    });
    return res.json(operacion?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_OPERACION", e);
  }
};

// ✅ Eliminar una operación por ID
const deleteOperacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await models.operacion.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Operación no encontrada" });
    return res.json({ message: "Operación eliminada" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_OPERACION", e);
  }
};

export {
  getOperaciones,
  getOperacion,
  createOperacion,
  updateOperacion,
  deleteOperacion,
};

