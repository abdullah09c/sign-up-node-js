# Sign Up Form with Node.js and PostgreSQL

A complete sign-up form with backend integration using Node.js, Express, and PostgreSQL.

## Features

- ✅ Email validation
- ✅ Username uniqueness check
- ✅ Password hashing with bcrypt
- ✅ Terms and conditions checkbox
- ✅ Password visibility toggle
- ✅ Real-time form validation
- ✅ PostgreSQL database integration
- ✅ Modern UI with blur effects

## Setup Instructions

### 1. Prerequisites

Make sure you have installed:

- Node.js (v14 or higher)
- PostgreSQL Server
- npm (comes with Node.js)

### 2. Database Setup

1. Start your PostgreSQL server
2. Open PostgreSQL client (psql) and run the commands in `database_setup.sql`:

   ```sql
   \i database_setup.sql
   ```

   Or copy and paste the SQL commands manually.

### 3. Configure Database Connection

Create a `.env` file in the project root with your PostgreSQL connection settings:

```env
DB_HOST=localhost
DB_USER=your_postgresql_username
DB_PASSWORD=your_postgresql_password
DB_NAME=signup_db
DB_PORT=5432
```

You can copy the `.env.example` file and modify it with your database credentials:

```bash
cp .env.example .env
```

### 4. Install Dependencies

Run the following command in the project directory:

```bash
npm install
```

### 5. Start the Server

Run one of these commands:

```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

### 6. Access the Application

Open your browser and go to:

```url
http://localhost:3000
```

## File Structure

```list
dbms(academic-project)/
├── server.js              # Node.js backend server
├── index.html             # Frontend HTML
├── styles.css             # Styling with blur effects
├── main.js                # Frontend JavaScript
├── database_setup.sql     # Database creation script
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## API Endpoints

### POST /signup

Creates a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "confirm-password": "password123",
  "terms": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account created successfully!",
  "userId": 1
}
```

## Security Features

- Password hashing using bcrypt
- SQL injection prevention with parameterized queries
- Email and username uniqueness validation
- CORS enabled for frontend-backend communication

## Author

Abdullah Al Fuwad

## License

ISC License
