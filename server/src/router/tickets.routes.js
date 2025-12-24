import { Router } from "express";

import { PERMISSIONS } from "#config.js";
import { checkPermission } from "#middlewares/authentication.middlewares.js";

const { CREATE, DELETE, READ, UPDATE } = PERMISSIONS;

const ticketRoutes = Router();

ticketRoutes.get("/", checkPermission(READ), (request, response) => {
  return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
});

ticketRoutes.get("/:id", checkPermission(READ), (request, response) => {
  return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
});

ticketRoutes.post("/", checkPermission(CREATE), (request, response) => {
  return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
});

ticketRoutes.patch("/:id", checkPermission(UPDATE), (request, response) => {
  return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
});

ticketRoutes.delete("/:id", checkPermission(DELETE), (request, response) => {
  return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
});

export default ticketRoutes;
