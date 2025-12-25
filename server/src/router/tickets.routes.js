import { Router } from "express";

import { PERMISSIONS } from "#config.js";
import { checkPermission } from "#middlewares/authentication.middlewares.js";
import { createTicket, deleteTicket, getAllTickets, updateTicket, getTicketsById } from "#controllers/tickets.controller.js";

const { CREATE, DELETE, READ, UPDATE } = PERMISSIONS;

const ticketRoutes = Router();

// ticketRoutes.get("/", checkPermission(READ),  (request, response) => {
//   return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
// });

// ticketRoutes.get("/:id", checkPermission(READ),  (request, response) => {
//   return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
// });

// ticketRoutes.post("/", checkPermission(CREATE),  (request, response) => {
//   return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
// });

// ticketRoutes.patch("/:id", checkPermission(UPDATE),  (request, response) => {
//   return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
// });

// ticketRoutes.delete("/:id", checkPermission(DELETE),  (request, response) => {
//   return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
// });

ticketRoutes.get("/", checkPermission(READ), getAllTickets);

ticketRoutes.get("/:id", checkPermission(READ), getTicketsById);

ticketRoutes.post("/", checkPermission(CREATE), createTicket);

ticketRoutes.patch("/:id", checkPermission(UPDATE), updateTicket);

ticketRoutes.delete("/:id", checkPermission(DELETE), deleteTicket);

export default ticketRoutes;
