import Classroom from "../models/Classroom.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller to get all classrooms
export const getAllClassrooms = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming req.user is populated with logged-in user's info

    if (!user) {
      throw new ApiError(402, "User not found");
    }

    let classrooms;

    if (user.role === "principal") {
      // If the user is a principal, fetch all classrooms
      classrooms = await Classroom.find()
        .populate("teacher")
        .populate("student");
    } else if (user.role === "teacher") {
      // If the user is a teacher, fetch only their classrooms
      classrooms = await Classroom.find({ teacher: user._id })
        .populate("teacher")
        .populate("student");
    } else if (user.role === "student") {
      // If the user is a student, fetch the classroom they are part of
      classrooms = await Classroom.find({ student: user._id })
        .populate("teacher")
        .populate("student");
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, classrooms, "Classroom Fetched Successfully"));
  } catch (error) {
    throw new ApiError(500, error || "Server error");
  }
};
