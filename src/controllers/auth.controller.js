import bcrypt from "bcryptjs";
import pool from "../config/db.js";

import generateToken from "../utils/generateToken.js";
import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { full_name, username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    //Check whether username already exists before inserting
    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const query = `
            INSERT INTO users (full_name, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *
        `;

    const result = await pool.query(query, [
      full_name,
      username,
      hashedPassword,
      role,
    ]);

    const user = result.rows[0];

    res.status(201).json({
      user_id: user.user_id,
      full_name: user.full_name,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.findByUsername(username);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  //Check active status during login
  if (!user.is_active) {
    return res.status(403).json({
      message: "Account is inactive",
    });
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user.user_id,
      full_name: user.full_name,
      role: user.role,
    },
  });
};
