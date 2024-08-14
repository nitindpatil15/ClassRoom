import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CreateTimeTable = ({ onClose, onCreateTimetable, classId }) => {
  const token = Cookies.get("accessToken");
  const host = "http://localhost:5600/api/v1";
  const [timetableData, setTimetableData] = useState({
    subject: "",
    startTime: "",
    endTime: "",
    day:[]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTimetableData({ ...timetableData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${host}/timetable/timetables/${classId}`, // Include classId in the URL
        timetableData,
        {
          headers: {
            Authorization: `Bearer${token}`, // Fixed space after "Bearer"
          },
        }
      );
      onCreateTimetable(response.data.data);
      onClose();
    } catch (error) {
      console.error("Error in Creating Timetable:", error);
      alert("Error in Creating Timetable");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl mb-4">Create TimeTable</h2>
        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-4">
            <label className="block mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={timetableData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Start Time</label>
            <input
              type="text"
              name="startTime"
              value={timetableData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">End time</label>
            <input
              type="text"
              name="endTime"
              value={timetableData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Days</label>
            <input
              type="text"
              name="day"
              value={timetableData.day}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-500 border border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTimeTable;
