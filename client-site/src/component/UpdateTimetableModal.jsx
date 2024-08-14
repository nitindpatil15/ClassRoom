import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UpdateTimetableModal = ({ timetable, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    subject: "",
    startTime: "",
    endTime: "",
    day: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (timetable) {
      setFormData({
        subject: timetable.subject || "",
        startTime: timetable.startTime || "",
        endTime: timetable.endTime || "",
        day: timetable.day || "",
      });
    }
  }, [timetable]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.patch(
        `https://classroom-edc1.onrender.com/api/v1/timetable/timetables/u/${timetable._id}`,
        formData,
        {
          headers: {
            "Authorization": `Bearer${Cookies.get("accessToken")}`,
          },
        }
      );

      onUpdate(response.data.data);
      onClose();
    } catch (err) {
      console.error("Error updating timetable:", err);
      setError("Failed to update timetable. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Update Timetable</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Day</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTimetableModal;
