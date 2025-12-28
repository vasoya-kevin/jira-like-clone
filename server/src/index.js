import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import { SERVER_CONFIG } from "#config.js";
import router from "#router/routes.js";
import { connectDB } from "#database/connection.js";

const { PORT } = SERVER_CONFIG;

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json())
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/v1', router)

connectDB();

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(`Server is running on PORT: ${PORT}`);
});