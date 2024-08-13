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
router.post('/create-student/:classroomId',verifyJWT,teacher,registerStudent)
router.patch("/students/u/:id", verifyJWT, teacher, updateStudentDetails);
router.delete("/students/d/:id", verifyJWT, teacher, deleteStudent);

export default router;
