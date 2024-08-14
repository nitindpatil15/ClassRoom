import { Router } from "express";
import { teacher, verifyJWT } from "../middlewares/authMiddleware.js";
import { getStudentsByClassroom } from "../controllers/teacher.controller.js";

const router = Router();

router.get(
  "/students/get-students/:classId",
  verifyJWT,
  getStudentsByClassroom
);
export default router;
