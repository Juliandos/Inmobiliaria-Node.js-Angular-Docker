import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout/:id", logout);

export { router };
