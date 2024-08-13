import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asynchandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    console.log("Token from middelware to check ", token);
    if (!token) {
      throw new ApiError(401, "UnAuthorized request");
    }

    const decodedJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(`Decoded JWT: ${decodedJWT}`);

    if (!decodedJWT) {
      throw new ApiError(401, "Unauthorized request from middleware");
    }
    console.log("ID: ", decodedJWT.id);
    const user = await User.findById(decodedJWT?.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    req.user = user;
    console.log(`User Authenticated: ${user}`);
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const admin = asynchandler((req, res, next) => {
  if (req.user && req.user.role === "principal") {
    next();
  } else {
    throw new ApiError(500, "Not authorized as admin");
  }
});

export const teacher = asynchandler(async (req, res, next) => {
  if (req.user && req.user.role === "teacher") {
    next();
  } else {
    throw new ApiError(500, "Not authorized as Teacher");
  }
});

export const student = asynchandler(async (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    throw new ApiError(500, "Not authorized as student");
  }
});
