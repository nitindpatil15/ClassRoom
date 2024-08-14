import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: '*', // Set your specific domain here if using credentials
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ["Content-Type", 'Authorization', 'auth-token'],
  credentials: true,
};

app.use(cors(corsOptions));

// Config settings in CORS middleware for setting limits on data
app.use(express.json({ limit: "50mb" }));

// Parse incoming requests in the URL of the browser
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the public folder
app.use(express.static("public"));

// Access cookies from the user browser
app.use(cookieParser());

// Routes import
import authRoutes from "./Routes/authRoutes.js";
import principalRoutes from "./Routes/principalRoutes.js";
import teacherRoutes from "./Routes/teacherRoutes.js";
import dashboardRoutes from "./Routes/dadhboardRoute.js"
import timetableRoutes from "./Routes/timetableRoutes.js"
import { createPrincipal } from "./controllers/auth.controller.js";

createPrincipal();

// Router declaration
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/principal', principalRoutes);
app.use('/api/v1/teacher', teacherRoutes);
app.use('/api/v1/timetable', timetableRoutes);

export { app };
