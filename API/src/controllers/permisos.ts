import { Request, Response } from "express";
import { Op } from "sequelize";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";

// ✅ Obtener todos los permisos con roles y módulos asociados
const getPermisos = async (req: Request, res: Response) => {
  try {
    const permisos = await models.permisos.findAll({
      include: [
        {
          model: models.roles,
          as: "rol",
          attributes: ["id", "nombre"]
        },
        {
          model: models.modulos,
          as: "modulo",
          attributes: ["id", "nombre"]
        }
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
      include: [
        { model: models.roles, as: "rol", attributes: ["id", "nombre"] },
        { model: models.modulos, as: "modulo", attributes: ["id", "nombre"] }
      ],
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
    const { nombre, c, r, u, d, rol_id, modulo_id } = req.body;
    
    if (!nombre || !rol_id || !modulo_id) {
      return res.status(400).json({ 
        message: "nombre, rol_id y modulo_id son requeridos" 
      });
    }

    // Verificar que no exista ya un permiso para el mismo rol y módulo
    const existingPermiso = await models.permisos.findOne({
      where: { rol_id, modulo_id }
    });

    if (existingPermiso) {
      return res.status(409).json({ 
        message: "Ya existe un permiso para este rol y módulo" 
      });
    }

    const permiso = await models.permisos.create({
      nombre,
      c: c || false,
      r: r || false,
      u: u || false,
      d: d || false,
      rol_id,
      modulo_id
    });

    // Obtener el permiso creado con sus relaciones
    const newPermiso = await models.permisos.findByPk(permiso.id, {
      include: [
        { model: models.roles, as: "rol", attributes: ["id", "nombre"] },
        { model: models.modulos, as: "modulo", attributes: ["id", "nombre"] }
      ],
    });

    return res.status(201).json(newPermiso?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_PERMISO", e);
  }
};

// ✅ Actualizar un permiso por ID
const updatePermiso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, c, r, u, d, rol_id, modulo_id } = req.body;

    // Si se está cambiando rol_id o modulo_id, verificar que no exista duplicado
    if (rol_id || modulo_id) {
      const currentPermiso = await models.permisos.findByPk(id);
      if (!currentPermiso) {
        return res.status(404).json({ message: "Permiso no encontrado" });
      }

      const finalRolId = rol_id || currentPermiso.dataValues.rol_id;
      const finalModuloId = modulo_id || currentPermiso.dataValues.modulo_id;

      const existingPermiso = await models.permisos.findOne({
        where: { 
          rol_id: finalRolId, 
          modulo_id: finalModuloId,
          id: { [Op.ne]: id } // Excluir el permiso actual
        }
      });

      if (existingPermiso) {
        return res.status(409).json({ 
          message: "Ya existe un permiso para este rol y módulo" 
        });
      }
    }

    const [updated] = await models.permisos.update({
      ...(nombre && { nombre }),
      ...(typeof c === 'boolean' && { c }),
      ...(typeof r === 'boolean' && { r }),
      ...(typeof u === 'boolean' && { u }),
      ...(typeof d === 'boolean' && { d }),
      ...(rol_id && { rol_id }),
      ...(modulo_id && { modulo_id })
    }, { where: { id } });

    if (!updated) return res.status(404).json({ message: "Permiso no encontrado" });
    
    const permiso = await models.permisos.findByPk(id, {
      include: [
        { model: models.roles, as: "rol", attributes: ["id", "nombre"] },
        { model: models.modulos, as: "modulo", attributes: ["id", "nombre"] }
      ],
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

// ✅ Obtener permisos por rol
const getPermisosByRol = async (req: Request, res: Response) => {
  try {
    const { rol_id } = req.params;
    const permisos = await models.permisos.findAll({
      where: { rol_id },
      include: [
        { model: models.roles, as: "rol", attributes: ["id", "nombre"] },
        { model: models.modulos, as: "modulo", attributes: ["id", "nombre"] }
      ],
    });
    return res.json(permisos.map((p) => p.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_PERMISOS_BY_ROL", e);
  }
};

// ✅ Obtener permisos por módulo
const getPermisosByModulo = async (req: Request, res: Response) => {
  try {
    const { modulo_id } = req.params;
    const permisos = await models.permisos.findAll({
      where: { modulo_id },
      include: [
        { model: models.roles, as: "rol", attributes: ["id", "nombre"] },
        { model: models.modulos, as: "modulo", attributes: ["id", "nombre"] }
      ],
    });
    return res.json(permisos.map((p) => p.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_PERMISOS_BY_MODULO", e);
  }
};

export {
  getPermisos,
  getPermiso,
  createPermiso,
  updatePermiso,
  deletePermiso,
  getPermisosByRol,
  getPermisosByModulo,
};