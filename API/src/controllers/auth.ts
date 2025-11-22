import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { models } from "../db/database";
import { handleHttp } from "../utils/error.handle";

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

    const hashed = await bcryptjs.hash(password, saltRounds);
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
    console.log('🔐 Login attempt:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password)
      return res.status(400).json({ message: "email y password requeridos" });
    
aún no puedo hacer PushManager    console.log('📋 Buscando usuario:', email);
    const user = await models.usuarios.findOne({
      where: { email },
      include: [{ model: models.roles, as: "rol", attributes: ["id", "nombre"] }],
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    
    console.log('✅ Usuario encontrado:', user.dataValues.email);
    
    if (!user.dataValues.password) {
      console.log('❌ Usuario sin contraseña');
      return res.status(400).json({ message: "Usuario sin contraseña, usa OAuth2" });
    }
    
    console.log('🔒 Comparando contraseña...');
    const ok = await bcryptjs.compare(password, user.dataValues.password);
    if (!ok) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    
    console.log('✅ Contraseña correcta, generando tokens...');
    const accessToken = generateAccessToken({ id: user.dataValues.id, email: user.dataValues.email });
    const refreshToken = generateRefreshToken({ id: user.dataValues.id });

    console.log('💾 Guardando refresh token...');
    user.set('refreshToken', refreshToken);
    await user.save();

    console.log('✅ Login exitoso');
    return res.json({ accessToken, refreshToken, user });
  } catch (e: any) {
    console.error('❌ Error en login:', e);
    console.error('Stack:', e.stack);
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
