import { Request, Response } from "express";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";

const getUsuarios = async (req: Request, res: Response) => {
  try {
    const data = await models.usuarios.findAll({ include: [{ model: models.roles, as: "rol" }] });
    return res.json(data.map((u) => u.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_USUARIOS", e);
  }
};

const getUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await models.usuarios.findByPk(id, { 
      include: [{ model: models.roles, as: "rol" }] 
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(user.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_USUARIO", e);
  }
};

const createUsuario = async (req: Request, res: Response) => {
  try {
    const user = await models.usuarios.create(req.body);
    // Obtener el usuario creado con su rol
    const userWithRol = await models.usuarios.findByPk(user.id, {
      include: [{ model: models.roles, as: "rol" }]
    });
    return res.status(201).json(userWithRol?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_USUARIO", e);
  }
};

const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await models.usuarios.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Usuario no encontrado" });
    // Obtener el usuario actualizado con su rol
    const user = await models.usuarios.findByPk(id, {
      include: [{ model: models.roles, as: "rol" }]
    });
    return res.json(user?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_USUARIO", e);
  }
};

const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await models.usuarios.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({ message: "Usuario eliminado" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_USUARIO", e);
  }
};

export { getUsuario, getUsuarios, createUsuario, updateUsuario, deleteUsuario}