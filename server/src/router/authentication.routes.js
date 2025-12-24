import { login, register } from "#controllers/authentication.controller.js";
import { Router } from "express";

const authenticationRoutes = Router();

// authenticationRoutes.post("/register", (request, response) => {
//   console.log('request: ', request);
//   return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
// });

// authenticationRoutes.post("/login", (request, response) => {
//   return response.status(200).send(`you are "${request.originalUrl}" are currently on this path`);
// });

authenticationRoutes.post("/register", register);

authenticationRoutes.post("/login", login);

export default authenticationRoutes;
