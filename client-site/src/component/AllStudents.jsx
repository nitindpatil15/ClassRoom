import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import UpdateEntityModal from "./UpdateEntityModal";

const AllStudents = () => {
  const { id } = useParams();
  const token = Cookies.get("accessToken");
  const host = "http://localhost:5600/api/v1";
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        const response = await axios.get(`${host}/principal/students`, {
          headers: {
            Authorization: `Bearer${token}`, // Fixed space after "Bearer"
          },
        });
        console.log(response.data.data);
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching classroom details:", error);
      }
    };

    fetchClassroomDetails();
  }, [id, token]);

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`${host}/principal/students/d/${studentId}`, {
        headers: {
          Authorization: `Bearer${token}`,
        },
      });
      setStudents(students.filter((student) => student._id !== studentId));
      alert("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student");
    }
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleModalUpdate = async (updatedStudent) => {
    try {
      const response = await axios.patch(
        `${host}/principal/students/u/${updatedStudent._id}`,
        updatedStudent,
        {
          headers: {
            Authorization: `Bearer${token}`,
          },
        }
      );
      setStudents(
        students.map((student) =>
          student._id === updatedStudent._id ? response.data.data : student
        )
      );
      alert("Student updated successfully");
      handleModalClose()
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student");
    }
  };

  return (
    <div className="p-4 w-full h-full bg-white mt-40">
      <h2 className=" font-bold text-4xl my-4">Students</h2>
      {students.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="w-auto bg-gray-200 border-b border-gray-300">
              <th className="py-2 px-4 text-center">Sr. No</th>
              <th className="py-2 px-4 text-center">Name</th>
              <th className="py-2 px-4 text-center">Email</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id} className="border-b border-gray-200">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.email}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleUpdate(student)}
                    className="mr-2 px-4 py-1 text-blue-500 border border-blue-500 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
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
        <p>No students found.</p>
      )}

      {isModalOpen && (
        <UpdateEntityModal
          entity={selectedStudent}
          onClose={handleModalClose}
          onUpdate={handleModalUpdate}
          entityType="Student"
        />
      )}
    </div>
  );
};

export default AllStudents;
