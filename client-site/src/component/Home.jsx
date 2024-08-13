import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const token = Cookies.get("accessToken");
  const host = "https://classroom-edc1.onrender.com/api/v1";
  const [classrooms, setClassrooms] = useState([]);
  const [user,setUser]=useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(`${host}/dashboard/classroom`, {
          headers: {
            Authorization: `Bearer${token}`, // Added space after "Bearer"
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

    const getUser = async () => {
        try {
          const response = await axios.post(
            `${host}/users/profile`,
            {},
            { 
              headers: {
                'Authorization': `Bearer${token}`
              },
              withCredentials: true }
          );
          console.log(response.data);
          setUser(response.data.data); // Access data directly
        } catch (error) {
          console.log(error, "Error in Fetching user");
        }
      };
  
      getUser();

    fetchClassrooms();
  }, [token]);

  const handleClassRoomClick = (id) => {
    navigate(`/classroom/${id}`);
  };

  return (
    <>
      <div className="flex bg-gray-400 my-4 justify-between px-4 items-center">
        <div className="text-4xl uppercase font-bold mb-4">
          Classrooms
        </div>
        <button onClick={() => console.log("Add ClassRoom")}>Add ClassRoom</button>
      </div>
      <div className="bg-white p-4 border-b border-gray-200 flex justify-around text-justify flex-wrap">
        {classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <div
              key={classroom._id}
              className="mb-4 h-80 text-xl p-4 w-80 border-black border-2 cursor-pointer"
              onClick={() => handleClassRoomClick(classroom._id)}
            >
              <h2 className="text-lg font-bold">{classroom.name}</h2>
              <p>
                Teacher: {classroom.teacher?.name || "No teacher assigned"}
              </p>{" "}
              {/* Added optional chaining */}
              <p>Start Time: {classroom.startTime}</p>
              <p>End Time: {classroom.endTime}</p>
              <p>Days: {classroom.days.join(", ")}</p>
            </div>
          ))
        ) : (
          <p>No classrooms found.</p>
        )}
      </div>
    </>
  );
};

export default Home;
