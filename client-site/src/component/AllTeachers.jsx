// ... other imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UpdateEntityModal from "./UpdateEntityModal";
import RegisterTeacher from "./RegisterTeacher";

const AllTeachers = () => {
  const token = Cookies.get("accessToken");
  const host = "https://classroom-edc1.onrender.com/api/v1";
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${host}/principal/teachers`, {
          headers: {
            Authorization: `Bearer${token}`, // Added space after Bearer
          },
        });
        setTeachers(response.data.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, [token]);

  const handleDelete = async (teacherId) => {
    try {
      await axios.delete(`${host}/principal/teachers/d/${teacherId}`, {
        headers: {
          Authorization: `Bearer${token}`, // Added space after Bearer
        },
      });
      setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
      alert("Teacher deleted successfully");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Error deleting teacher");
    }
  };

  const handleUpdate = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleModalUpdate = async (updatedTeacher) => {
    try {
      const response = await axios.patch(
        `${host}/principal/teachers/u/${updatedTeacher._id}`,
        updatedTeacher,
        {
          headers: {
            Authorization: `Bearer${token}`, // Added space after Bearer
          },
        }
      );
      setTeachers(
        teachers.map((teacher) =>
          teacher._id === updatedTeacher._id ? response.data.data : teacher
        )
      );
      alert("Teacher updated successfully");
      handleModalClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Error updating teacher");
    }
  };

  const handleRegisterTeacher = () => {
    setIsRegisterModalOpen(true);
  };

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegisterSubmit = async (newTeacher) => {
    try {
      const response = await axios.post(
        `${host}/principal/create-teacher`,
        newTeacher,
        {
          headers: {
            Authorization: `Bearer${token}`, // Added space after Bearer
          },
        }
      );
      setTeachers([...teachers, response.data.data]);
      alert("Teacher registered successfully");
      setIsRegisterModalOpen(false);
    } catch (error) {
      console.error("Error registering teacher:", error);
      alert("Error registering teacher");
    }
  };

  return (
    <div className="p-4 w-full h-full bg-white mt-40">
      <div className="flex px-4 justify-between">
        <h2 className=" font-bold text-4xl my-4">Teachers</h2>
        <button
          onClick={handleRegisterTeacher}
          className="border-2 px-2 border-black h-12 rounded-xl"
        >
          Register Teacher
        </button>
      </div>

      {teachers.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 ">
          <thead>
            <tr className="w-auto bg-gray-200 border-b border-gray-300">
              <th className="py-2 px-4 text-center">Sr. No</th>
              <th className="py-2 px-4 text-center">Name</th>
              <th className="py-2 px-4 text-center">Email</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher._id} className="border-b border-gray-200">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{teacher.name}</td>
                <td className="py-2 px-4">{teacher.email}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleUpdate(teacher)}
                    className="mr-2 px-4 py-1 text-blue-500 border border-blue-500 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="px-4 py-1 text-red-500 border border-red-500 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No teachers found.</p>
      )}

      {isModalOpen && (
        <UpdateEntityModal
          entity={selectedTeacher}
          onClose={handleModalClose}
          onUpdate={handleModalUpdate}
          entityType="Teacher"
        />
      )}

      {isRegisterModalOpen && (
        <RegisterTeacher
          onClose={handleRegisterModalClose}
          onRegister={handleRegisterSubmit}
        />
      )}
    </div>
  );
};

export default AllTeachers;
