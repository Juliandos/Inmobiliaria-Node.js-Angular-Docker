import { Request, Response } from "express";
import { Op } from "sequelize";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";

// ✅ Obtener todos los módulos con permisos asociados
const getModulos = async (req: Request, res: Response) => {
  try {
    const modulos = await models.modulos.findAll({
      include: [
        {
          model: models.permisos,
          as: "permisos",
          include: [
            {
              model: models.roles,
              as: "rol",
              attributes: ["id", "nombre"]
            }
          ]
        }
      ],
    });
    return res.json(modulos.map((m) => m.toJSON()));
  } catch (e) {
    handleHttp(res, "ERROR_GET_MODULOS", e);
  }
};

// ✅ Obtener un módulo por ID
const getModulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const modulo = await models.modulos.findByPk(id, {
      include: [
        {
          model: models.permisos,
          as: "permisos",
          include: [
            {
              model: models.roles,
              as: "rol",
              attributes: ["id", "nombre"]
            }
          ]
        }
      ],
    });
    if (!modulo) return res.status(404).json({ message: "Módulo no encontrado" });
    return res.json(modulo.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_GET_MODULO", e);
  }
};

// ✅ Crear un módulo
const createModulo = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }

    // Verificar que no exista un módulo con el mismo nombre
    const existingModulo = await models.modulos.findOne({
      where: { nombre }
    });

    if (existingModulo) {
      return res.status(409).json({ 
        message: "Ya existe un módulo con este nombre" 
      });
    }

    const modulo = await models.modulos.create({ nombre });
    return res.status(201).json(modulo.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_CREATE_MODULO", e);
  }
};

// ✅ Actualizar un módulo por ID
const updateModulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (nombre) {
      // Verificar que no exista otro módulo con el mismo nombre
      const existingModulo = await models.modulos.findOne({
        where: { 
          nombre,
          id: { [Op.ne]: id } // Excluir el módulo actual
        }
      });

      if (existingModulo) {
        return res.status(409).json({ 
          message: "Ya existe un módulo con este nombre" 
        });
      }
    }

    const [updated] = await models.modulos.update({ nombre }, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Módulo no encontrado" });
    
    const modulo = await models.modulos.findByPk(id, {
      include: [
        {
          model: models.permisos,
          as: "permisos",
          include: [
            {
              model: models.roles,
              as: "rol",
              attributes: ["id", "nombre"]
            }
          ]
        }
      ],
    });
    
    return res.json(modulo?.toJSON());
  } catch (e) {
    handleHttp(res, "ERROR_UPDATE_MODULO", e);
  }
};

// ✅ Eliminar un módulo por ID
const deleteModulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay permisos asociados a este módulo
    const permisosCount = await models.permisos.count({ where: { modulo_id: id } });
    if (permisosCount > 0) {
      return res.status(400).json({ 
        message: "No se puede eliminar el módulo porque tiene permisos asociados" 
      });
    }

    const deleted = await models.modulos.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Módulo no encontrado" });
    
    return res.json({ message: "Módulo eliminado" });
  } catch (e) {
    handleHttp(res, "ERROR_DELETE_MODULO", e);
  }
};

export {
  getModulos,
  getModulo,
  createModulo,
  updateModulo,
  deleteModulo,
};