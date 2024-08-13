import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  days: [
    {
      type: String,
      required: true,
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Classroom = mongoose.model("Classroom", classroomSchema);

export default Classroom;
