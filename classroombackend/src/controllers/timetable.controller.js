import Classroom from "../models/Classroom.js";
import Timetable from "../models/Timetable.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const createTimetable = asynchandler(async (req, res) => {
  try {
    const{classroomId}= req.params
    const {subject, startTime, endTime, day } = req.body;
    const userId = req.user._id; // Get user ID from request

    // Check if the user is a teacher
    const user = await User.findById(userId);

    // Validate if classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      throw new ApiError(404, "Classroom not found");
    }

    const timetable = new Timetable({
      classroomId,
      subject,
      startTime,
      endTime,
      day,
      createdBy: userId,
    });
    await timetable.save();
    return res
      .status(201)
      .json(new ApiResponse(200, timetable, "Timetable Created"));
  } catch (error) {
    console.error("Error creating timetable:", error);
    throw new ApiError(500, "Server Error");
  }
});

// Get all timetable entries for a classroom
export const getTimetablesByClassroom = asynchandler(async (req, res) => {
  try {
    const { classroomId } = req.params;
    const timetables = await Timetable.find({ classroomId }).populate(
      "createdBy"
    );
    return res
      .status(200)
      .json(new ApiResponse(200, { timetables }, "TimeTable Fetched"));
  } catch (error) {
    console.error("Error fetching timetables:", error);
    throw new ApiError(500, "Server Error");
  }
});

// Update a timetable entry (admins and teachers can update)
export const updateTimetable = asynchandler(async (req, res) => {
    try {
      const { timetableId } = req.params;
      const { subject, startTime, endTime, day } = req.body;
      const userId = req.user._id; // Get user ID from request
  
      // Find the timetable entry
      const timetable = await Timetable.findById(timetableId);
      if (!timetable) {
        throw new ApiError(404, "Timetable not found");
      }
  
      // Check if user is allowed to update
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(401, "Unauthorized User");
      }
  
      // Update timetable entry using $set
      const updatedTimetable = await Timetable.findByIdAndUpdate(
        timetableId,
        {
          $set: {
            subject,
            startTime,
            endTime,
            day
          }
        },
        {
          new: true, // Return the updated document
          runValidators: true // Validate the updated document against schema
        }
      );
  
      if (!updatedTimetable) {
        throw new ApiError(404, "Timetable not updated");
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, updatedTimetable, "Updated successfully"));
    } catch (error) {
      console.error("Error updating timetable:", error);
      throw new ApiError(500, "Server Error");
    }
  });

// Delete a timetable entry (admins and teachers can delete)
export const deleteTimetable = asynchandler(async (req, res) => {
  try {
    const { timetableId } = req.params;
    const userId = req.user._id; // Get user ID from request

    // Find the timetable entry
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      throw new ApiError(401, "Timetable not found");
    }

    // Check if user is allowed to delete
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(402, "UnAuthorize User");
    }

    // Delete timetable entry
    await Timetable.findByIdAndDelete(timetableId);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Timetable deleted successfully"));
  } catch (error) {
    console.error("Error deleting timetable:", error);
    throw new ApiError(500,"Server error")
  }
});
