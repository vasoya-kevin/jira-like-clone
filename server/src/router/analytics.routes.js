import { getNormalAnalytics } from "#controllers/analytics.controller.js";
import { Router } from "express";

const router = Router();

router.get('/', getNormalAnalytics)

export default router