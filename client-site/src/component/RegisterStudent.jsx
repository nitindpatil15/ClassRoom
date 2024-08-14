import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const RegisterStudent = ({ onClose, onRegister, classId }) => {
  const token = Cookies.get("accessToken");
  const host = "http://localhost:5600/api/v1";
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${host}/principal/create-student/${classId}`, // Include classId in the URL
        studentData,
        {
          headers: {
            Authorization: `Bearer${token}`, // Fixed space after "Bearer"
          },
        }
      );
      onRegister(response.data.data);
      onClose();
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Error registering student");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl mb-4">Register Student</h2>
        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={studentData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={studentData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={studentData.password}
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

export default RegisterStudent;
