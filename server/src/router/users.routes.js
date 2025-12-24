import { Router } from "express";
import { createUserByAdmin, deleteUserByAdmin, getAllUsers, getProfile, updateUserByAdmin } from "#controllers/users.controller.js";
import { checkOwnershipOrAdmin, checkPermission } from "#middlewares/authentication.middlewares.js";
import { PERMISSIONS } from "#config.js";

const { CREATE, DELETE, READ, UPDATE } = PERMISSIONS;

const userRoutes = Router();

// userRoutes.get("/", checkPermission(READ), (request, response) => {
//   return response
//     .status(200)
//     .send(`you are "${request.originalUrl}" are currently on this path`);
// });

// userRoutes.get("/:id", checkPermission(READ), (request, response) => {
//   return response
//     .status(200)
//     .send(`you are "${request.originalUrl}" are currently on this path`);
// });

// userRoutes.post("/", checkPermission(CREATE), (request, response) => {
//   return response
//     .status(200)
//     .send(`you are "${request.originalUrl}" are currently on this path`);
// });

// userRoutes.patch("/:id", checkPermission(UPDATE), checkOwnershipOrAdmin, (request, response) => {
//   return response
//     .status(200)
//     .send(`you are "${request.originalUrl}" are currently on this path`);
// });

// userRoutes.delete("/:id", checkPermission(DELETE), (request, response) => {
//   return response
//     .status(200)
//     .send(`you are "${request.originalUrl}" are currently on this path`);
// });

userRoutes.get("/", checkPermission(READ), getAllUsers);
userRoutes.get("/profile", checkPermission(READ), getProfile);

userRoutes.post("/", checkPermission(CREATE), createUserByAdmin);

userRoutes.patch("/:id", checkPermission(UPDATE), checkOwnershipOrAdmin, updateUserByAdmin);

userRoutes.delete("/:id", checkPermission(DELETE), checkOwnershipOrAdmin, deleteUserByAdmin);


export default userRoutes;
