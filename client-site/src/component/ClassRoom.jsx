import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import RegisterStudent from "./RegisterStudent"; // Import RegisterStudent modal
import UpdateEntityModal from "./UpdateEntityModal"; // Import UpdateEntityModal
import CreateTimeTable from "./CreateTimeTable"; // Import CreateTimeTable modal
import UpdateTimetableModal from "./UpdateTimetableModal"; // Import UpdateTimetableModal

const ClassRoom = () => {
  const { id } = useParams();
  const token = Cookies.get("accessToken");
  const host = "https://classroom-edc1.onrender.com/api/v1";
  const [students, setStudents] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateTimetableModalOpen, setIsCreateTimetableModalOpen] =
    useState(false);
  const [isUpdateTimetableModalOpen, setIsUpdateTimetableModalOpen] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        const response = await axios.get(
          `${host}/teacher/students/get-students/${id}`,
          {
            headers: {
              Authorization: `Bearer${token}`,
            },
          }
        );
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching classroom details:", error);
      }
    };

    const fetchTimetables = async () => {
      try {
        const response = await axios.get(`${host}/timetable/classrooms/${id}/timetables`, {
          headers: {
            Authorization: `Bearer${token}`,
          },
        });
        setTimetables(response.data.data.timetables);
      } catch (error) {
        console.error("Error fetching timetables:", error);
      }
    };

    fetchClassroomDetails();
    fetchTimetables();
  }, [id, token]);

  const handleTimeTableDelete = async (timetableId) => {
    try {
      await axios.delete(`${host}/timetable/timetables/d/${timetableId}`, {
        headers: {
          Authorization: `Bearer${token}`,
        },
      });
      setTimetables(timetables.filter((timetable) => timetable._id !== timetableId));
      alert("TimeTable deleted successfully");
    } catch (error) {
      console.error("Error deleting TimeTable:", error);
      alert("Error deleting TimeTable");
    }
  };

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
    setIsRegisterModalOpen(false);
  };

  const handleRegisterUser = () => {
    setIsRegisterModalOpen(true);
  };

  const handleRegisterClose = () => {
    setIsRegisterModalOpen(false);
  };

  const handleUpdateClose = () => {
    setSelectedStudent(null);
  };

  const handleRegister = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  const handleCreateTimetable = (newTimetable) => {
    setTimetables([...timetables, newTimetable]);
  };

  const handleCreateTimetableModalOpen = () => {
    setIsCreateTimetableModalOpen(true);
  };

  const handleCreateTimetableModalClose = () => {
    setIsCreateTimetableModalOpen(false);
  };

  const handleUpdateTimetable = (timetable) => {
    setSelectedTimetable(timetable);
    setIsUpdateTimetableModalOpen(true);
  };

  const handleUpdateTimetableClose = () => {
    setSelectedTimetable(null);
    setIsUpdateTimetableModalOpen(false);
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
      handleUpdateClose();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleTimetableUpdate = async (updatedTimetable) => {
    try {
      const response = await axios.patch(
        `${host}/timetable/classrooms/${id}/timetables/${updatedTimetable._id}`,
        updatedTimetable,
        {
          headers: {
            Authorization: `Bearer${token}`,
          },
        }
      );
      setTimetables(
        timetables.map((timetable) =>
          timetable._id === updatedTimetable._id
            ? response.data.data
            : timetable
        )
      );
      alert("Timetable updated successfully");
      handleUpdateTimetableClose();
    } catch (error) {
      console.error("Error updating timetable:", error);
    }
  };

  return (
    <div className="p-4 w-full h-full bg-white">
      {/* Students Section */}
      <div className="flex px-4 justify-between">
        <h2 className="font-bold text-4xl my-4">Students</h2>
        {(Cookies.get("isAdmin") || Cookies.get("isTeacher")) && (
          <button
            onClick={handleRegisterUser}
            className="border-2 px-2 border-black h-12 rounded-xl"
          >
            Register Student
          </button>
        )}
        {Cookies.get("isTeacher") && (
          <button
            onClick={handleCreateTimetableModalOpen}
            className="border-2 px-2 border-black h-12 rounded-xl"
          >
            Create TimeTable
          </button>
        )}
      </div>
      {students.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="w-auto bg-gray-200 border-b border-gray-300">
              <th className="py-2 px-4 text-center">Sr. No</th>
              <th className="py-2 px-4 text-center">Name</th>
              <th className="py-2 px-4 text-center">Email</th>
              {(Cookies.get("isAdmin") || Cookies.get("isTeacher")) && (
                <th className="py-2 px-4 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id} className="border-b border-gray-200">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.email}</td>
                {(Cookies.get("isAdmin") || Cookies.get("isTeacher")) && (
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
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}

      {/* Timetable Section */}
      <div className="flex px-4 justify-between mt-20 ">
        <h2 className="font-bold text-4xl my-4">Timetables</h2>
        {Cookies.get("isTeacher") && (
          <button
            onClick={handleCreateTimetableModalOpen}
            className="border-2 px-2 border-black h-12 rounded-xl"
          >
            Create TimeTable
          </button>
        )}
      </div>
      {timetables.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="w-auto bg-gray-200 border-b border-gray-300">
              <th className="py-2 px-4 text-center">Sr. No</th>
              <th className="py-2 px-4 text-center">Subject</th>
              <th className="py-2 px-4 text-center">Time</th>
              <th className="py-2 px-4 text-center">Days</th>
              {(Cookies.get("isAdmin") || Cookies.get("isTeacher")) && (
                <th className="py-2 px-4 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {timetables.map((timetable, index) => (
              <tr key={timetable._id} className="border-b border-gray-200">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{timetable.subject}</td>
                <td className="py-2 px-4">{timetable.startTime}-{timetable.endTime}</td>
                <td className="py-2 px-4">{timetable.day}</td>
                {Cookies.get("isTeacher")||Cookies.get("isAdmin") && (
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleUpdateTimetable(timetable)}
                      className="mr-2 px-4 py-1 text-blue-500 border border-blue-500 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleTimeTableDelete(timetable._id)}
                      className="mr-2 px-4 py-1 text-red-500 border border-red-500 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No timetables found.</p>
      )}

      {/* Register Student Modal */}
      {isRegisterModalOpen && (
        <RegisterStudent
          onClose={handleRegisterClose}
          onRegister={handleRegister}
          classId={id} // Pass the classroom ID here
        />
      )}

      {/* Create TimeTable Modal */}
      {isCreateTimetableModalOpen && (
        <CreateTimeTable
          onClose={handleCreateTimetableModalClose}
          onCreateTimetable={handleCreateTimetable}
          classId={id} // Pass the classroom ID here
        />
      )}

      {/* Update Student Modal */}
      {selectedStudent && (
        <UpdateEntityModal
          entity={selectedStudent}
          onClose={handleUpdateClose}
          onUpdate={handleModalUpdate}
          entityType="Student"
        />
      )}

      {/* Update Timetable Modal */}
      {selectedTimetable && (
        <UpdateTimetableModal
          timetable={selectedTimetable}
          onClose={handleUpdateTimetableClose}
          onUpdate={handleTimetableUpdate}
        />
      )}
    </div>
  );
};

export default ClassRoom;
