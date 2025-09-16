import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

export function generateAccessToken(payload: object, expiresIn: string | number = "1h") {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function generateRefreshToken(payload: { id: number }, expiresIn: string | number = "7d") {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign({ id: payload.id }, JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
