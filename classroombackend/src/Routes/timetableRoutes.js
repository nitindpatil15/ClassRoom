import { Router } from "express";
import { createTimetable, deleteTimetable, getTimetablesByClassroom, updateTimetable } from "../controllers/timetable.controller.js";
import { teacher, verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router()

router.post('/timetables/:classroomId',verifyJWT,teacher, createTimetable); // Only teachers can create timetables
router.get('/classrooms/:classroomId/timetables', verifyJWT,getTimetablesByClassroom); // Get timetables for a classroom
router.patch('/timetables/u/:timetableId',verifyJWT,teacher, updateTimetable); // Admins and teachers can update
router.delete('/timetables/d/:timetableId',verifyJWT,teacher, deleteTimetable); // Admins and teachers can delete

export default router