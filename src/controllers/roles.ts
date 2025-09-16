import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { models } from "@/db/database";

// ✅ GET ALL
const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await models.roles.findAll();
    return res.json(roles.map(r => r.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_ROLES", e);
  }
};

// ✅ GET BY ID
const getRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rol = await models.roles.findByPk(id);
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });
    return res.json(rol.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_ROL", e);
  }
};

// ✅ CREATE
const createRol = async (req: Request, res: Response) => {
  try {
    const nuevoRol = await models.roles.create(req.body);
    return res.status(201).json(nuevoRol.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_ROL", e);
  }
};

// ✅ UPDATE
const updateRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rol = await models.roles.findByPk(id);
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

    await rol.update(req.body);
    return res.json(rol.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_ROL", e);
  }
};

// ✅ DELETE
const deleteRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rol = await models.roles.findByPk(id);
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

    await rol.destroy();
    return res.json({ message: "Rol eliminado correctamente" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_ROL", e);
  }
};

export { getRoles, getRol, createRol, updateRol, deleteRol };
