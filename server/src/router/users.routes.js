import { Router } from "express";
import { createUserByAdmin, deleteUserByAdmin, getAllUsers, getProfile, updateUserByAdmin } from "#controllers/users.controller.js";
import { checkOwnershipOrAdmin, checkPermission } from "#middlewares/authentication.middlewares.js";
import { PERMISSIONS } from "#config.js";

const { CREATE, DELETE, READ, UPDATE } = PERMISSIONS;

const userRoutes = Router();
const routePath = 'users'

userRoutes.get("/", checkPermission(routePath, READ), getAllUsers);
userRoutes.get("/profile", checkPermission(routePath, READ), getProfile);

userRoutes.post("/", checkPermission(routePath, CREATE), createUserByAdmin);

userRoutes.patch("/:id", checkPermission(routePath, UPDATE), checkOwnershipOrAdmin, updateUserByAdmin);

userRoutes.delete("/:id", checkPermission(routePath, DELETE), checkOwnershipOrAdmin, deleteUserByAdmin);


export default userRoutes;
