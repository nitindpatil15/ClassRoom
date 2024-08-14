import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const Navbar = () => {
  const token = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handlelogout = async () => {
    try {
      const response = await axios.post(
        "https://classroom-edc1.onrender.com/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer${token}`, // Ensure there's a space between Bearer and the token
          },
        }
      );
      Cookies.remove("accessToken");
      Cookies.remove("isLoggedIn");
      if (Cookies.get("isAdmin")) {
        Cookies.remove("isAdmin");
      }
      if (Cookies.set("isTeacher")) {
        Cookies.remove("isTeacher");
      }
      alert("LogOut Successfully");
      navigate("/"); // Optionally, redirect to the homepage or login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
      if (error.response && error.response.status === 401) {
        alert("Unauthorized access - Please log in again");
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 bg-black border-b-2 flex justify-between p-1  items-center shadow-md">
        <div className="text-gray-400 md:ml-12 text-2xl flex items-center">
          <Link to="/" className="font-bold text-white uppercase">
            <span className="text-orange-500">Know</span>Ur
            <span className="text-green-500">Class</span>
          </Link>
        </div>
        <div className="flex items-center p-2 text-white">
          <Link to="/" className="mx-4 font-semibold md:ml-10 mt-1 text-lg">
            Home
          </Link>
          {Cookies.get("isAdmin") ? (
            <>
              <Link
                to="/principal/allteachers"
                className="mx-4 font-semibold mt-1 text-lg"
              >
                AllTeachers
              </Link>
              <Link
                to="/principal/allstudents"
                className="mx-4 font-semibold mt-1 text-lg"
              >
                AllStudents
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="relative m-2 mr-5">
          {!Cookies.get("isLoggedIn") ? (
            <>
              <button
                onClick={toggleDropdown}
                className="md:mr-5 font-semibold p-2 text-2xl text-white rounded-full"
              >
                Login
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 h-28 bg-gray-400 border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg">
                  <Link
                    to="/student/login"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/teacher/login"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Teacher Login
                  </Link>
                  <Link
                    to="/principal/login"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Principal/Admin Login
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={toggleDropdown}
                className="md:mr-5 font-semibold p-2 text-2xl text-white rounded-full"
              >
                {Cookies.get("isAdmin")?("Admin"):"User"}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg">
                  <button
                    onClick={handlelogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Add a margin top equal to the height of the navbar */}
      <div style={{ marginTop: "64px" }}></div>
    </>
  );
};

export default Navbar;
