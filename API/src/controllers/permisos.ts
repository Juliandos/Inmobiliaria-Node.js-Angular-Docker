import { Request, Response } from "express";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";

// ✅ Obtener todos los permisos con roles asociados
const getPermisos = async (req: Request, res: Response) => {
  try {
    const permisos = await models.permisos.findAll({
      include: [
        {
          model: models.roles,
          as: "rol_id_roles",
        },
      ],
    });
    return res.json(permisos.map((p) => p.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_PERMISOS", e);
  }
};

// ✅ Obtener un permiso por ID
const getPermiso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permiso = await models.permisos.findByPk(id, {
      include: [{ model: models.roles, as: "rol_id_roles" }],
    });
    if (!permiso) return res.status(404).json({ message: "Permiso no encontrado" });
    return res.json(permiso.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_PERMISO", e);
  }
};

// ✅ Crear un permiso
const createPermiso = async (req: Request, res: Response) => {
  try {
    const permiso = await models.permisos.create(req.body);
    return res.status(201).json(permiso.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_PERMISO", e);
  }
};

// ✅ Actualizar un permiso por ID
const updatePermiso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await models.permisos.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Permiso no encontrado" });
    const permiso = await models.permisos.findByPk(id, {
      include: [{ model: models.roles, as: "rol_id_roles" }],
    });
    return res.json(permiso?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_PERMISO", e);
  }
};

// ✅ Eliminar un permiso por ID
const deletePermiso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await models.permisos.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Permiso no encontrado" });
    return res.json({ message: "Permiso eliminado" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_PERMISO", e);
  }
};

export {
  getPermisos,
  getPermiso,
  createPermiso,
  updatePermiso,
  deletePermiso,
};
