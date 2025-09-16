import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { models } from "..//db/database";
import { handleHttp } from "../utils/error.handle";

const saltRounds = 10;

// REGISTER
const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rolId } = req.body;
    if (!email || !password || !nombre)
      return res
        .status(400)
        .json({ message: "nombre, email y password requeridos" });

    const exists = await models.usuarios.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await models.usuarios.create({
      nombre,
      email,
      password: hashed,
      rolId,
    });
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Guardar refresh token en usuario
    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(201)
      .json({ accessToken, refreshToken, user: user.toJSON() });
  } catch (e) {
    handleHttp(res, "ERROR_REGISTER", e);
  }
};

// LOGIN
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email y password requeridos" });

    const user = await models.usuarios.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Credenciales inválidas" });

    if (!user.password)
      return res
        .status(400)
        .json({ message: "Usuario sin contraseña, usa OAuth2" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken, user: user.toJSON() });
  } catch (e) {
    handleHttp(res, "ERROR_LOGIN", e);
  }
};

// REFRESH TOKEN
const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken es requerido" });

    // Verificamos y obtenemos payload
    const payload = verifyRefreshToken(refreshToken) as any;
    const user = await models.usuarios.findByPk(payload.id);
    if (!user)
      return res.status(401).json({ message: "Usuario no encontrado" });

    // Verificamos que coincida con token guardado
    if (user.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Refresh token inválido" });

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    // opcional: regenerar refresh token
    const newRefreshToken = generateRefreshToken({ id: user.id });
    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (e) {
    handleHttp(res, "ERROR_REFRESH", e);
  }
};

// LOGOUT
const logout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await models.usuarios.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.refreshToken = undefined;
    await user.save();
    return res.json({ message: "Logout OK" });
  } catch (e) {
    handleHttp(res, "ERROR_LOGOUT", e);
  }
};

export { register, login, refresh, logout };
