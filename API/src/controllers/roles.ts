import { Request, Response } from "express";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";


// Obtener todos los roles
const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await models.roles.findAll({
      include: [
        {
          model: models.usuarios,
          as: "usuarios",
        },
      ],
    });
    return res.json(roles.map((r) => r.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_ROLES", e);
  }
};

//Obtener un rol por ID
const getRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rol = await models.roles.findByPk(id, {
      include: [{ model: models.usuarios, as: "usuarios" }],
    });
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });
    return res.json(rol.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_ROL", e);
  }
};

//Crear un nuevo rol
const createRol = async (req: Request, res: Response) => {
  try {
    const rol = await models.roles.create(req.body);
    return res.status(201).json(rol.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_ROL", e);
  }
};

//Actualizar un rol por ID
const updateRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await models.roles.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Rol no encontrado" });
    const rol = await models.roles.findByPk(id);
    return res.json(rol?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_ROL", e);
  }
};

//Eliminar un rol por ID
const deleteRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await models.roles.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Rol no encontrado" });
    return res.json({ message: "Rol eliminado" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_ROL", e);
  }
};

export { getRoles, getRol, createRol, updateRol, deleteRol };
