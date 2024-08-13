import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getStudentsByClassroom = asynchandler(async (req, res) => {
  try {
    const students = await User.find({
      classroom: req.params.classId,
      role: "student",
    });
    res.json(new ApiResponse(200, students, "Fetched Student by Classroom"));
  } catch (error) {
    throw new ApiError(500, "Error fetching students", error);
  }
});
