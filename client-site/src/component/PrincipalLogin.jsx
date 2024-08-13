import React from "react";
import "material-icons/iconfont/material-icons.css";
import { Link } from "react-router-dom";

const PrincipalLogin = () => {
  return (
    <div className="mt-24 mx-8">
      <div className="flex justify-around">
        <form className="w-[40rem] border-2 p-20">
          <h1 className="text-white text-3xl font-medium my-6">
            Principal/Admin Login
          </h1>
          <div className="flex flex-col">
            <label className="text-white text-start font-bold mb-2 mt-4 text-2xl">Email</label>
            <input
              className="p-3 rounded-lg"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter Your Email"
            />
            <label className="text-white text-start font-bold mb-2 mt-4 text-2xl">
              Password
            </label>
            <input
              className="p-3 rounded-lg"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Password"
            />
            <button className="bg-blue-700 my-3 p-2">Submit</button>
            <div className="text-white text-start text-xl flex justify-between m-2">
              <div>
              Login as {" "}
              <Link to="/Student/login" className="text-red-500">
                 Student
              </Link>{" "}</div> 
              <div>
              Login as {" "}
              <Link to="/teacher/login" className="text-red-500">
                 Teacher
              </Link>{" "}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrincipalLogin;
