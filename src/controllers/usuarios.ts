import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { models } from "@/db/database";

// ✅ GET ALL
const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await models.usuarios.findAll({
      include: [{ model: models.roles, as: "rol" }],
    });
    return res.json(usuarios.map((u) => u.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_USUARIOS", e);
  }
};

// ✅ GET BY ID
const getUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await models.usuarios.findByPk(id, {
      include: [{ model: models.roles, as: "rol" }],
    });
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(usuario.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_USUARIO", e);
  }
};

// ✅ CREATE
const createUsuario = async (req: Request, res: Response) => {
  try {
    const nuevoUsuario = await models.usuarios.create(req.body);
    return res.status(201).json(nuevoUsuario.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_USUARIO", e);
  }
};

// ✅ UPDATE
const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await models.usuarios.findByPk(id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    await usuario.update(req.body);
    return res.json(usuario.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_USUARIO", e);
  }
};

// ✅ DELETE
const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await models.usuarios.findByPk(id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    await usuario.destroy();
    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_USUARIO", e);
  }
};

export { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario };
