import User from "../models/User.js";
import Classroom from "../models/Classroom.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createClassroom = asynchandler(async (req, res) => {
  const { name, startTime, endTime, days } = req.body;
  try {
    const classroom = new Classroom({
      name,
      startTime,
      endTime,
      days,
    });
    await classroom.save();

    return res
      .status(200)
      .json(new ApiResponse(200, classroom, "Classroom created"));
  } catch (error) {
    console.error("Error: ", error);
    throw new ApiResponse(500, "Error creating classroom");
  }
});

export const assignTeacher = asynchandler(async (req, res) => {
  const { classroomId, teacherId } = req.params;
  try {
    const teacher = await User.findById(teacherId);
    if (teacher.role !== "teacher") {
      throw new ApiError(400, "Invalid teacher");
    }

    // Check if the teacher is already assigned to a classroom
    if (teacher.classroom) {
      throw new ApiError(
        400,
        "This teacher is already assigned to another classroom"
      );
    }

    const classroom = await Classroom.findById(classroomId);
    classroom.teacher = teacherId;
    const assignedTeachertoClass = await classroom.save();

    teacher.classroom = classroomId;
    await teacher.save();

    return res
      .status(200)
      .json(200, assignedTeachertoClass, "Teacher assigned");
  } catch (error) {
    throw new ApiError(500, "Error assigning teacher");
  }
});

export const getAllTeachers = asynchandler(async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    return res.json(
      new ApiResponse(200, teachers, "Fetched all Teachers successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching teachers");
  }
});

export const getAllStudents = asynchandler(async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    return res.json(
      new ApiResponse(200, students, "Student Fetched Successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching students");
  }
});

export const updateTeacherDetails = asynchandler(async (req, res) => {
  try {
    const { name, email } = req.body;
    const { teacherId } = req.params;

    if (!(email && name)) {
      throw new ApiError(401, "All fields are Required!");
    }

    const TeacherUpdate = await User.findByIdAndUpdate(
      teacherId,
      {
        $set: {
          name,
          email,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Detail Saved Successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error ");
  }
});

export const updateStudentDetails = asynchandler(async (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    if (!(email && name)) {
      throw new ApiError(401, "All fields are Required!");
    }

    const StudentUpdate = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Detail Saved Successfully"));
  } catch (error) {
    console.error("Error: ", error);
    throw new ApiError(500, "Server Error ");
  }
});

export const deleteTeacher = asynchandler(async (req, res) => {
  try {
    const { teacherid } = req.params;

    if (!teacherid) {
      throw new ApiError("Id is required");
    }

    const removeteacher = await User.findByIdAndDelete(teacherid);

    if (!removeteacher) {
      throw new ApiError("Invalid Id please check it or try again!!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Teacher Deleted Successfully!!"));
  } catch (error) {
    throw new ApiError(500, error || "Error in Deleting Teacher");
  }
});

export const deleteStudent = asynchandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("Id is required");
    }

    const removeStudent = await User.findByIdAndDelete(id);

    if (!removeStudent) {
      throw new ApiError("Invalid Id please check it or try again!!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Student Deleted Successfully!!"));
  } catch (error) {
    throw new ApiError(500, "Error in Deleting Video");
  }
});

export const registerStudent = async (req, res) => {
  const { classroomId } = req.params;
  const { name, email, password } = req.body;

  try {
    const studentExists = await User.findOne({ email });

    if (studentExists) {
      throw new ApiError(401, "Student already exists");
    }

    const student = await User.create({
      name,
      email,
      password,
      role: "student",
      classroom: classroomId,
    });

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      throw new ApiError(404, "Classroom not found");
    }

    classroom.student.push(student._id);
    await classroom.save();

    return res
      .status(201)
      .json(
        new ApiResponse(200, student, "Student created and Added to Class")
      );
  } catch (error) {
    throw new ApiError(500, "Error registering student");
  }
};

export const registerTeacher = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const teacherExists = await User.findOne({ email });

    if (teacherExists) {
      throw new ApiError(401, "Student already exists");
    }

    const teacher = await User.create({
      name,
      email,
      password,
      role: "teacher",
    });

    res
      .status(201)
      .json(
        new ApiResponse(200, teacher, "Student created and Added to Class")
      );
  } catch (error) {
    throw new ApiError(500, "Error registering student");
  }
};
