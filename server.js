const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname)));

// PostgreSQL database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or your actual DB URL
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to PostgreSQL and create table
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database");

    // Create users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await client.query(createTableQuery);
    console.log("Users table ready");
    client.release();
  } catch (err) {
    console.error("Error connecting to PostgreSQL:", err);
  }
}

// Initialize database
initializeDatabase();

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Sign up route
app.post("/signup", async (req, res) => {
  try {
    const { email, username, password, terms } = req.body;

    // Validation
    if (!email || !username || !password || !terms) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!terms) {
      return res.status(400).json({
        success: false,
        message: "You must accept the terms and conditions",
      });
    }

    // Check if user already exists
    const checkUserQuery =
      "SELECT * FROM users WHERE email = $1 OR username = $2";
    const checkResult = await pool.query(checkUserQuery, [email, username]);

    if (checkResult.rows.length > 0) {
      const existingUser = checkResult.rows[0];
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertUserQuery =
      "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id";
    const insertResult = await pool.query(insertUserQuery, [
      email,
      username,
      passwordHash,
    ]);

    res.json({
      success: true,
      message: "Account created successfully!",
      userId: insertResult.rows[0].id,
    });
  } catch (error) {
    console.error("Server error:", error);

    // Handle specific PostgreSQL errors
    if (error.code === "23505") {
      // Unique violation
      if (error.constraint === "users_email_key") {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
      if (error.constraint === "users_username_key") {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
