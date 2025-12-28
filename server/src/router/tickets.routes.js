import { Router } from "express";

import { PERMISSIONS } from "#config.js";
import { checkPermission } from "#middlewares/authentication.middlewares.js";
import { createTicket, deleteTicket, getAllTickets, updateTicket, getTicketsById } from "#controllers/tickets.controller.js";

const { CREATE, DELETE, READ, UPDATE } = PERMISSIONS;

const ticketRoutes = Router();
const routePath = "tickets";

ticketRoutes.get("/", checkPermission(routePath, READ), getAllTickets);

ticketRoutes.get("/:id", checkPermission(routePath, READ), getTicketsById);

ticketRoutes.post("/", checkPermission(routePath, CREATE), createTicket);

ticketRoutes.patch("/:id", checkPermission(routePath, UPDATE), updateTicket);

ticketRoutes.delete("/:id", checkPermission(routePath, DELETE), deleteTicket);

export default ticketRoutes;
