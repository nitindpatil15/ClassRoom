import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddClassroom = ({ onClose, onAdd }) => {
  const token = Cookies.get("accessToken");
  const host = "http://localhost:5600/api/v1";
  const [classroomData, setClassroomData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    days: [],
    teacherId: ""
  });
  const [teachers, setTeachers] = useState([]); // State to hold the list of teachers

  // Fetch the list of teachers when the component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${host}/principal/teachers`, {
          headers: {
            Authorization: `Bearer${token}`,
          },
        });
        setTeachers(response.data.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassroomData({ ...classroomData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${host}/principal/create-classroom`,
        classroomData,
        {
          headers: {
            Authorization: `Bearer${token}`,
          },
        }
      );
      onAdd(response.data.data);
    } catch (error) {
      console.error("Error adding classroom:", error);
      alert("Error adding classroom");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl mb-4">Add Classroom</h2>
        <form onSubmit={handleSubmit} className='text-start'>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={classroomData.name}
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
              value={classroomData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">End Time</label>
            <input
              type="text"
              name="endTime"
              value={classroomData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Days</label>
            <input
              type="text"
              name="days"
              value={classroomData.days}
              onChange={(e) => setClassroomData({ ...classroomData, days: e.target.value.split(',') })}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Teacher</label>
            <select
              name="teacherId"
              value={classroomData.teacherId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassroom;
