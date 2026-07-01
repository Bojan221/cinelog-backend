const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, password, terms, email } = req.body;
    const salt = 10;

    const hashedPassword = await bcrypt.hash(password, salt);
    const query = "SELECT * FROM users WHERE email = ? OR username = ?";
    const [rows] = await db.query(query, [email, username]);

    if (rows.length > 0) {
      return res.status(400).json({
        message: "The user with this email or user name already exists.",
      });
    }

    const insertQuery =
      "INSERT INTO users (email, password, username, first_name, last_name) VALUES(?,?,?,?,?)";

    const [result] = await db.query(insertQuery, [
      email,
      hashedPassword,
      username,
      firstName,
      lastName,
    ]);

    if (result.affectedRows === 1) {
      return res.status(201).json({ message: "User created successfully!" });
    }

    return res.status(500).json({ message: "Failed to create user" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email= ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "User with this email doesnt exist" });
    }
    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        userName: user.username,
        avatar: user.avatar,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "30d",
      },
    );
    await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Login successfull", accessToken });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const refreshAuth = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "Session expired" });
    }

    const decoded = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ? AND refresh_token = ?",
      [decoded.id, refreshToken],
    );
    if (rows.length === 0) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const user = rows[0];

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        userName: user.username,
        avatar: user.avatar,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, refreshAuth };
