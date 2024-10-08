import React, { useState } from "react";
import "material-icons/iconfont/material-icons.css";
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const TeacherLogin = () => {
  const host = "https://classroom-edc1.onrender.com/api/v1"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // For navigation after login

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post(
        `${host}/auth/teacher/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(response)
      const { token } = response.data.data;
      Cookies.set("accessToken", token);
      Cookies.set("isLoggedIn", true);
      Cookies.set("isTeacher", true);
      navigate("/"); // Redirect after successful login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="mt-24 mx-8">
      <div className="flex justify-around">
        <form onSubmit={handleLogin} className="w-[40rem] border-2 p-20">
          <h1 className="text-white text-4xl font-medium my-6">
            Teacher Login
          </h1>
          <div className="flex flex-col ">
            <label className="text-white text-start font-bold mb-2 text-2xl">
              Email
            </label>
            <input
              className="p-3 rounded-lg"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter Your Email"
            />
            <label className="text-white text-start mt-6 font-bold mb-2 text-2xl">
              Password
            </label>
            <input
              className="p-3 rounded-lg"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Password"
            />
            <button className="bg-blue-700 mt-6 p-2">Submit</button>
            <div className="text-white text-start text-xl flex justify-between m-2">
              <div>
              Login as {" "}
              <Link to="/principal/login" className="text-red-500">
                 Principal
              </Link>{" "}</div> 
              <div>
              Login as {" "}
              <Link to="/student/login" className="text-red-500">
                 Student
              </Link>{" "}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
