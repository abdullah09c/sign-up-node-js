-- Database setup for the signup form
-- Run these commands in your MySQL client

-- Create database
CREATE DATABASE IF NOT EXISTS signup_db;

-- Use the database
USE signup_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create an index on email for faster lookups
CREATE INDEX idx_email ON users(email);

-- Optional: Create an index on username for faster lookups
CREATE INDEX idx_username ON users(username);

-- Show table structure
DESCRIBE users;
