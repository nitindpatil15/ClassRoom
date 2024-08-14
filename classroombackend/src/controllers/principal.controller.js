import User from "../models/User.js";
import Classroom from "../models/Classroom.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createClassroom = asynchandler(async (req, res) => {
  const { name, startTime, endTime, days, teacherId } = req.body;
  try {
    const classroomData = {
      name,
      startTime,
      endTime,
      days,
    };

    // Add teacherId if provided
    if (teacherId) {
      classroomData.teacher = teacherId;
    }

    const classroom = new Classroom(classroomData);
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
  const { classroomId } = req.params;
  const { name, email, password } = req.body; // Assume teacher's details are sent in the request body

  try {
    // Create a new teacher
    const newTeacher = await User.create({
      name,
      email,
      password,
      role: 'teacher',
    });

    // Assign the newly created teacher to the classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      throw new ApiError(404, "Classroom not found");
    }

    classroom.teacher = newTeacher._id;
    const assignedTeachertoClass = await classroom.save();

    // Update the teacher's classroom field
    newTeacher.classroom = classroomId;
    await newTeacher.save();

    return res.status(200).json({
      message: "Teacher registered and assigned successfully",
      data: assignedTeachertoClass,
    });
  } catch (error) {
    throw new ApiError(500, error || "Error assigning teacher");
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
    console.log(error)
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
        new ApiResponse(200, teacher, "Teacher created and Added to Class")
      );
  } catch (error) {
    throw new ApiError(500, "Error registering Teacher");
  }
};
