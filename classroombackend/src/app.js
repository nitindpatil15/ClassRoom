import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  headers: ["Content-Type", 'Authorization', 'auth-token'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, auth-token');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Config settings In CORS() middleware
// for setting limits on data
app.use(express.json({ limit: "50mb" }));

// parse incoming requests in url of browser
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// for any kind of static files, public is folder
app.use(express.static("public"));

// Accessing cookies from user browser which can only  be accessed by server side code using the following method
app.use(cookieParser());

// Routes import
import authRoutes from "./Routes/authRoutes.js"
import principalRoutes from "./Routes/principalRoutes.js"
import teacherRoutes from "./Routes/teacherRoutes.js"
import dashboardRoutes from "./Routes/dadhboardRoute.js"
import { createPrincipal } from "./controllers/auth.controller.js";

createPrincipal();

// Router Declaration
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/principal', principalRoutes);
app.use('/api/v1/teacher',teacherRoutes);

export { app };