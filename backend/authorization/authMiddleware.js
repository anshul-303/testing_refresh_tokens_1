import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import cookieParser from "cookie-parser";

export default function authMiddleware(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized access! Token is expired!" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    req.email = decoded.email;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
}
