import {Router} from "express";
import {
  assignTeacher,
  createClassroom,
  deleteStudent,
  deleteTeacher,
  getAllStudents,
  getAllTeachers,
  registerStudent,
  registerTeacher,
  updateStudentDetails,
  updateTeacherDetails,
} from "../controllers/principal.controller.js";
import { admin, teacher, verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create-teacher", verifyJWT, admin,registerTeacher);

router.post("/create-classroom", verifyJWT, admin,createClassroom);
router.post("/assign-teacher/:classroomId/:teacherId", verifyJWT, admin,assignTeacher);

router.get("/teachers", verifyJWT, admin, getAllTeachers);
router.patch("/teachers/u/:teacherid", verifyJWT, admin, updateTeacherDetails);
router.delete("/teachers/d/:teacherid", verifyJWT, admin, deleteTeacher);

router.post('/create-student/:classroomId',verifyJWT,teacher,registerStudent)
router.get("/students", verifyJWT, admin, getAllStudents);
router.patch("/students/u/:id", verifyJWT, teacher, updateStudentDetails);
router.delete("/students/d/:id", verifyJWT, teacher, deleteStudent);

export default router;
