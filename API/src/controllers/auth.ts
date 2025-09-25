import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";
import { AuthRequest } from "../middleware/auth";

const saltRounds = 10;

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido,  email, password, rol_id } = req.body;
    if (!nombre || !email || !password || !apellido) {
      return res.status(400).json({ message: "nombre, email y password requeridos" });
    }

    const exists = await models.usuarios.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await models.usuarios.create({
      nombre,
      apellido,
      email,
      password: hashed,
      rol_id,
    });

    const accessToken = generateAccessToken({ id: user.dataValues.id, email: user.dataValues.email });
    const refreshToken = generateRefreshToken({ id: user.dataValues.id });

    user.set('refreshToken', refreshToken);
    await user.save();

    const userData = await models.usuarios.findByPk(user.id, {
      include: [{ model: models.roles, as: "rol", attributes: ["id", "nombre"] }],
    });

    return res.status(201).json({
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (e) {
    handleHttp(res, "ERROR_REGISTER", e);
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password)
      return res.status(400).json({ message: "email y password requeridos" });
    
    const user = await models.usuarios.findOne({
      where: { email },
      include: [{ model: models.roles, as: "rol", attributes: ["id", "nombre"] }],
    });
    
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });
    
    if (!user.dataValues.password)
      return res.status(400).json({ message: "Usuario sin contraseña, usa OAuth2" });
    
    const ok = await bcrypt.compare(password, user.dataValues.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const accessToken = generateAccessToken({ id: user.dataValues.id, email: user.dataValues.email });
    const refreshToken = generateRefreshToken({ id: user.dataValues.id });

    user.set('refreshToken', refreshToken);
    await user.save();

    return res.json({ accessToken, refreshToken, user });
  } catch (e) {
    handleHttp(res, "ERROR_LOGIN", e);
  }
};

// REFRESH TOKEN
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken es requerido" });

    const payload = verifyRefreshToken(refreshToken) as any;
    
    const user = await models.usuarios.findByPk(payload.id, {
      include: [{ model: models.roles, as: "rol", attributes: ["id", "nombre"] }],
    });
    
    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });
    console.log("Payload: ", payload, refreshToken, );
    if (user.dataValues.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Refresh token inválido" });

    const accessToken = generateAccessToken({ id: user.dataValues.id, email: user.dataValues.email });
    const newRefreshToken = generateRefreshToken({ id: user.dataValues.id });
    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken: newRefreshToken, user });
  } catch (e) {
    handleHttp(res, "ERROR_REFRESH", e);
  }
};

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await models.usuarios.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.refreshToken = undefined;
    await user.save();
    return res.json({ message: "Logout OK" });
  } catch (e) {
    handleHttp(res, "ERROR_LOGOUT", e);
  }
};

// ✅ OBTENER PERMISOS DEL USUARIO ACTUAL
export const getUserPermissions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Obtener el usuario con su rol
    const user = await models.usuarios.findByPk(userId, {
      include: [{ model: models.roles, as: "rol", attributes: ["id", "nombre"] }],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener permisos del rol del usuario
    const permisos = await models.permisos.findAll({
      where: { rol_id: user.rol_id },
      include: [
        { model: models.modulos, as: "modulo", attributes: ["id", "nombre"] },
      ],
    });

    // Formatear respuesta para el frontend
    const permissionsResponse = {
      userId: user.id,
      email: user.email,
      rol: {
        id: user.rol?.id || 0,
        nombre: user.rol?.nombre || 'Sin rol'
      },
      permisos: permisos.map(permiso => ({
        modulo: permiso.modulo?.nombre || 'Sin módulo',
        c: permiso.c || false,
        r: permiso.r || false,
        u: permiso.u || false,
        d: permiso.d || false
      }))
    };

    return res.json(permissionsResponse);
  } catch (e) {
    handleHttp(res, "ERROR_GET_USER_PERMISSIONS", e);
  }
};
