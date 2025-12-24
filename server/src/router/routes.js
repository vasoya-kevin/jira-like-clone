import { Router } from "express";

import userRoutes from "./users.routes.js";
import ticketRoutes from "./tickets.routes.js";
import authenticationRoutes from "./authentication.routes.js";
import { authenticate } from "#middlewares/authentication.middlewares.js";

const router = Router();

router.use("/auth", authenticationRoutes);

router.use(authenticate);
router.use("/users", userRoutes);
router.use("/tickets", ticketRoutes);


export default router;
