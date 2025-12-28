import { login, register } from "#controllers/authentication.controller.js";
import { Router } from "express";

const authenticationRoutes = Router();

authenticationRoutes.post("/register", register);

authenticationRoutes.post("/login", login);

export default authenticationRoutes;
