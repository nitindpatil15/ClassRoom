import express from 'express';
import { getCurrentUser, loginUser, logout, PrincipalLogin, teacherLogin } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/Student/login', loginUser);
router.post("/admin/login", PrincipalLogin);
router.post("/teacher/login", teacherLogin);
router.post("/logout",verifyJWT, logout);
router.post("/users/profile",verifyJWT, getCurrentUser);

export default router;
