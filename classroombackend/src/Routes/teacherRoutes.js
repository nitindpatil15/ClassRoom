import { Router } from "express";
import { teacher, verifyJWT } from "../middlewares/authMiddleware.js";
import { getStudentsByClassroom } from "../controllers/teacher.controller.js";
import { deleteStudent, getAllStudents, registerStudent, updateStudentDetails } from "../controllers/principal.controller.js";

const router = Router();

router.get(
  "/students/get-students/:classId",
  verifyJWT,
  teacher,
  getStudentsByClassroom
);
export default router;
