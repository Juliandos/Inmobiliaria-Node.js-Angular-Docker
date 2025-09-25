import { Router } from "express";
import { register, login, refresh, logout, getUserPermissions } from "../controllers/auth";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout/:id", logout);
router.get("/permissions", verifyToken, getUserPermissions);

export { router };
