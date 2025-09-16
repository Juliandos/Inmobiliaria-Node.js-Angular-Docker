import { Request, Response } from "express";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";

// ✅ Listar todas las relaciones rol-permiso
const getRolesPermisos = async (req: Request, res: Response) => {
  try {
    const relaciones = await models.roles_permisos.findAll({
      include: [
        { model: models.roles, as: "rol" },
        { model: models.permisos, as: "permiso" },
      ],
    });
    return res.json(relaciones.map(r => r.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_ROLES_PERMISOS", e);
  }
};

// ✅ Obtener una relación específica por rol_id y permiso_id
const getRolPermiso = async (req: Request, res: Response) => {
  try {
    const { rol_id, permiso_id } = req.params;
    const relacion = await models.roles_permisos.findOne({
      where: { rol_id, permiso_id },
      include: [
        { model: models.roles, as: "rol" },
        { model: models.permisos, as: "permiso" },
      ],
    });
    if (!relacion) return res.status(404).json({ message: "Relación no encontrada" });
    return res.json(relacion.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_ROL_PERMISO", e);
  }
};

// ✅ Crear una nueva relación rol-permiso
const createRolPermiso = async (req: Request, res: Response) => {
  try {
    const { rol_id, permiso_id } = req.body;
    const nuevaRelacion = await models.roles_permisos.create({ rol_id, permiso_id });
    return res.status(201).json(nuevaRelacion.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_ROL_PERMISO", e);
  }
};

// ✅ Eliminar una relación rol-permiso
const deleteRolPermiso = async (req: Request, res: Response) => {
  try {
    const { rol_id, permiso_id } = req.params;
    const deleted = await models.roles_permisos.destroy({ where: { rol_id, permiso_id } });
    if (!deleted) return res.status(404).json({ message: "Relación no encontrada" });
    return res.json({ message: "Relación eliminada" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_ROL_PERMISO", e);
  }
};

export {
  getRolesPermisos,
  getRolPermiso,
  createRolPermiso,
  deleteRolPermiso,
};
