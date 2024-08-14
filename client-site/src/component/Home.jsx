import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AddClassroom from "./AddClassroom";

const Home = () => {
  const token = Cookies.get("accessToken");
  const host = "https://classroom-edc1.onrender.com/api/v1";
  const [classrooms, setClassrooms] = useState([]);
  const [showAddClassroom, setShowAddClassroom] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(`${host}/dashboard/classroom`, {
          headers: {
            Authorization: `Bearer${token}`, // Fixed space after "Bearer"
          },
        });
        console.log(response.data.data);
        setClassrooms(response.data.data);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
        if (error.response && error.response.status === 403) {
          console.error("Access denied");
        } else if (error.response && error.response.status === 401) {
          console.error("Unauthorized access - Please log in again");
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    fetchClassrooms();
  }, [token]);

  const handleClassRoomClick = (id) => {
    navigate(`/classroom/${id}`);
  };

  const handleAddClassroom = (newClassroom) => {
    setClassrooms([...classrooms, newClassroom]);
    setShowAddClassroom(false); // Close the modal
  };

  const handleAssignTeacher = async (classroomId) => {
    try {
      // Get teacher details through a prompt or replace this with a proper form input
      const teacherName = prompt("Enter Teacher's Name:");
      const teacherEmail = prompt("Enter Teacher's Email:");
      const teacherPassword = prompt("Enter Teacher's Password:"); // You may handle password more securely

      if (!teacherName || !teacherEmail || !teacherPassword) {
        alert("Please provide all required details");
        return;
      }

      const response = await axios.post(
        `${host}/principal/assign-teacher/${classroomId}`,
        {
          name: teacherName,
          email: teacherEmail,
          password: teacherPassword,
        },
        {
          headers: {
            Authorization: `Bearer${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Teacher registered and assigned successfully");
        setClassrooms((prevClassrooms) =>
          prevClassrooms.map((classroom) =>
            classroom._id === classroomId
              ? { ...classroom, teacher: response.data.data.teacher }
              : classroom
          )
        );
      }
    } catch (error) {
      console.error("Error assigning teacher:", error);
      alert("Failed to assign teacher");
    }
  };

  return (
    <>
      <div className="flex bg-gray-400 my-4 justify-between px-4 items-center">
        <div className="text-4xl uppercase font-bold mb-4">{Cookies.get("isadmin")?("Classrooms"):"ClassRoom"}</div>
        {Cookies.get("isAdmin") && (
          <button onClick={() => setShowAddClassroom(true)}>
            Add ClassRoom
          </button>
        )}
      </div>
      <div className="bg-white p-4 border-b border-gray-200 flex justify-around text-justify flex-wrap">
        {classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <div
              key={classroom._id}
              className="my-8 h-60 text-xl p-4 w-80 border-black border-2 cursor-pointer"
              onClick={() => handleClassRoomClick(classroom._id)}
            >
              <h2 className="text-lg font-bold">{classroom.name}</h2>
              <p>
                Teacher:{" "}
                {classroom.teacher?.name || (
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents navigation when button is clicked
                      handleAssignTeacher(classroom._id);
                    }}
                  >
                    Assign Teacher
                  </button>
                )}
              </p>
              <p>Start Time: {classroom.startTime}</p>
              <p>End Time: {classroom.endTime}</p>
              <p>Days: {classroom.days.join(", ")}</p>
            </div>
          ))
        ) : (
          <p>No classrooms found.</p>
        )}
      </div>
      {showAddClassroom && (
        <AddClassroom
          onClose={() => setShowAddClassroom(false)}
          onAdd={handleAddClassroom}
        />
      )}
    </>
  );
};

export default Home;
