//Setup the server
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import pool from "./database/dbconfig.js";
import authMiddleware from "./authorization/authMiddleware.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true, // allow cookies
  })
);
app.use(express.json()); // parse JSON bodies
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO trial_users (email, password)  values (?, ? );",
    [email, hashedPassword]
  );
  const [rows] = await pool.query("select * from trial_users;");
  console.log(rows);

  res.status(201).json({ message: "User created" });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [foundUser] = await pool.query(
      "select * from trial_users where email=?;",
      [email]
    );
    if (foundUser.length === 0) {
      res.status(404).json({ message: "The profile doesn't exist!" });
      return;
    } else if (foundUser.length === 1) {
      const match = await bcrypt.compare(password, foundUser[0].password);
      if (match) {
        const accessToken = jwt.sign(
          { email: foundUser[0].email },
          process.env.SECRET_KEY,
          { expiresIn: "5s" }
        );
        const refreshToken = jwt.sign(
          { email: foundUser[0].email },
          process.env.REFRESH_TOKEN_SECRET_KEY,
          { expiresIn: "7d" }
        );
        console.log(email, password, accessToken, refreshToken);

        res
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "strict",
            maxAge: 5000,
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "strict",
            maxAge: 3600 * 1000 * 24 * 7,
          })
          .status(200)
          .json({ message: "The user is logged in!" });
        return;
      } else {
        res.status(400).json({ message: "Incorrect password!" });
        return;
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

app.get("/refresh", (req, res) => {
  console.log("There is need of new Access token.");

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(403).json({ message: "The message is unauthorized!" });
  }
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY
  );
  const email = decoded.email;
  const newAccessToken = jwt.sign({ email: email }, process.env.SECRET_KEY, {
    expiresIn: "5s",
  });
  console.log(newAccessToken);
  res
    .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 5000,
    })
    .status(200)
    .json({ message: "The new access token has been created!" });
});

app.get("/get-user-details", authMiddleware, async (req, res) => {
  const email = req.email;
  const [foundUser] = await pool.query(
    "select * from trial_users where email=?;",
    [email]
  );
  res.status(200).json({
    userId: foundUser[0].userId,
    email: foundUser[0].email,
    message: "The user data is included in response!",
  });
});

app.get("/logout", async (req, res) => {
  try {
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Logged the user out!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{console.log("The server is running!")});
