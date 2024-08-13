import { Router } from "express";
import { getAllClassrooms } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/classroom", verifyJWT, getAllClassrooms);

export default router;
