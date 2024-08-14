import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  startTime: {
    type: String, // Consider using Date for actual time values
    required: true,
  },
  endTime: {
    type: String, // Consider using Date for actual time values
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
});

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;
