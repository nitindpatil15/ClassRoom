import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const ispasswordcorrect = await user.matchPassword(password);
    if (!ispasswordcorrect) {
      throw new ApiError(401, "Invalid password");
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("accessToken", token, { httpOnly: true })
      .json(new ApiResponse(200, { token, user }, ""));
  } catch (error) {
    throw new ApiError(500, "Server Error...");
  }
});

export const teacherLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const ispasswordcorrect = await user.matchPassword(password);
    if (!ispasswordcorrect) {
      throw new ApiError(401, "Invalid password");
    }
    if (user.role !== "teacher") {
      throw new ApiError(402, "Access Denied , Only teacher can Login");
    }
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("accessToken", token, { httpOnly: true })
      .json(
        new ApiResponse(200, { token, user }, "Teacher LoggedIn Successfully")
      );
  } catch (error) {
    throw new ApiError(500, error || "Server Error...");
  }
});

export const PrincipalLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const ispasswordcorrect = await user.matchPassword(password);
    if (!ispasswordcorrect) {
      throw new ApiError(401, "Invalid password");
    }
    if (user.role !== "principal") {
      throw new ApiError(402, "Access Denied , Only teacher can Login");
    }
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("accessToken", token, { httpOnly: true })
      .json(
        new ApiResponse(
          200,
          { token, user },
          "Principal/Admin LoggedIn Successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Server Error...");
  }
});

export const createPrincipal = asynchandler(async () => {
  try {
    const principalExists = await User.findOne({
      email: "principal@classroom.com",
    });
    if (!principalExists) {
      const principal = new User({
        name: "Principal",
        email: "principal@classroom.com",
        password: "Admin",
        role: "principal",
      });
      await principal.save();
    }
  } catch (error) {
    console.error("Error creating principal:", error);
    throw new ApiError(500, "Server Error");
  }
});

export const logout = asynchandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $unset: {
          accessToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
  } catch(error) {
    console.error("Error logging out:", error);
    throw new ApiError(500,"UnAuthorize User")
  }
});
