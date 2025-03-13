# 🚀 Express Prisma Boilerplate

![Express.js Boilerplate](https://img.shields.io/badge/Express.js-Boilerplate-blueviolet?style=for-the-badge&logo=express)

A modern, feature-rich Express.js boilerplate with Prisma, Socket.IO, custom aliases, and more!

[![Stars](https://img.shields.io/github/stars/your-username/express-prisma-app?style=social)](https://github.com/your-username/express-prisma-app)
[![Forks](https://img.shields.io/github/forks/your-username/express-prisma-app?style=social)](https://github.com/your-username/express-prisma-app)
![Express Version](https://img.shields.io/npm/v/express?style=flat-square&color=brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-orange?style=flat-square)

---

## 🌟 Why Use This Boilerplate?

This is a **production-ready**, **modern**, and **developer-friendly** Express.js boilerplate designed to kickstart your next project! Packed with cutting-edge tools and best practices, it eliminates setup headaches and lets you dive straight into building awesome features.

### 🎨 Key Features

- **🔋 Prisma ORM**: Type-safe database access with PostgreSQL support.
- **⚡ Socket.IO**: Real-time messaging and file sharing integrated on the same port as Express.
- **🛠 Custom Import Aliases**: Next.js-style `@/` imports for cleaner, more maintainable code.
- **✅ ESLint + Prettier**: Linting and formatting inspired by Next.js standards.
- **🔒 Authentication**: JWT-based auth with bcrypt password hashing.
- **📤 File Uploads**: Multer-powered single/multi-file uploads with Prisma integration.
- **💬 Real-Time Messaging**: Personal messaging between users with sender/receiver IDs stored in the database.
- **🌍 Structured Architecture**: Separate routes, controllers, and middleware for scalability.
- **🚦 Error Handling**: Global error middleware with detailed JSON responses (404, 500, etc.).
- **🛠 Development Ready**: Nodemon for hot reloading, plus production-ready scripts.

---

## 🖼 Preview

*Add a screenshot or GIF of your app in action here!*

---

## 🛠 Tech Stack

| Tool         | Purpose                 | Version   |
|--------------|-------------------------|-----------|
| Express.js   | Web Framework           | ^4.18.2   |
| Prisma       | ORM                     | ^5.10.2   |
| Socket.IO    | Real-time Communication | ^4.7.4    |
| JWT          | Authentication          | ^9.0.2    |
| Bcrypt       | Password Hashing        | ^5.1.1    |
| Multer       | File Uploads            | ^1.4.5-lts.1 |
| Joi          | Validation              | ^17.12.2  |
| Module-Alias | Custom Imports          | ^2.2.3    |
| ESLint       | Linting                 | ^8.57.0   |
| Prettier     | Code Formatting         | ^3.2.5    |
| Nodemon      | Development Server      | ^3.1.0    |

---

## 🚀 Quick Start

Get up and running in minutes!

### Prerequisites

- Node.js (>= 16.x)
- PostgreSQL (or your preferred Prisma-supported DB)
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/express-prisma-app.git
   cd express-prisma-app
   ```
2.Install dependencies
 ```bash
  npm install
```
3.Set up environment variables: Create a .env file in the root directory and add:
 ```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
 ```
📂 Project Structure
Here’s how the project is organized for clarity and scalability:
 ```bash
express-prisma-app/
├── src/
│   ├── config/          # Database and Socket.IO setup
│   │   ├── database.js  # Prisma client initialization
│   │   └── socket.js    # Socket.IO real-time setup
│   ├── controllers/     # Business logic
│   │   ├── authController.js    # Auth operations
│   │   ├── fileController.js    # File upload/delete logic
│   │   ├── messageController.js # Messaging logic
│   │   └── userController.js    # Placeholder for user operations
│   ├── middleware/      # Custom middleware
│   │   ├── authMiddleware.js    # JWT authentication
│   │   ├── errorMiddleware.js   # Global error handling
│   │   ├── multerMiddleware.js  # File upload handling
│   │   └── validationMiddleware.js # Placeholder for validation
│   ├── routes/          # API routes
│   │   ├── authRoutes.js    # Authentication routes
│   │   ├── fileRoutes.js    # File management routes
│   │   ├── messageRoutes.js # Messaging routes
│   │   └── userRoutes.js    # Placeholder for user routes
│   ├── utils/           # Utility functions
│   │   └── errorHandler.js # Placeholder for error utilities
│   ├── uploads/         # File storage directory
│   └── server.js        # Application entry point
├── prisma/              # Prisma schema and migrations
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Migration files (generated by Prisma)
├── .env                 # Environment variables
├── .eslintrc.json       # ESLint configuration
├── jsconfig.json        # Custom import aliases
└── package.json         # Dependencies and scripts

```
🌐 API Documentation
Detailed endpoints for interacting with the API:

Authentication
POST /api/auth/register
Register a new user.
Request Body:
json
 ```bash
{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
}
```
Response (201):
json
{
    "status": "success",
    "data": {
        "user": { "id": 1, "email": "user@example.com", "name": "John Doe" },
        "token": "jwt-token-here"
    }
}
POST /api/auth/login
Login and receive a JWT.
Request Body:
json
 ```bash
{
    "email": "user@example.com",
    "password": "password123"
}
```
Response (200):
json

  

 

Copy
{
    "status": "success",
    "data": {
        "user": { "id": 1, "email": "user@example.com", "name": "John Doe" },
        "token": "jwt-token-here"
    }
}
Files (Authenticated)
POST /api/files/upload/single
Upload a single file.
Request: Form-data with key image.
Response (201):
json

  

 

Copy
{
    "status": "success",
    "data": {
        "id": 1,
        "filename": "123456789-file.jpg",
        "path": "src/uploads/123456789-file.jpg",
        "userId": 1,
        "createdAt": "2025-03-13T00:00:00.000Z"
    }
}
POST /api/files/upload/multiple
Upload multiple files.
Request: Form-data with key images[].
Response (201):
json

  

 

Copy
{
    "status": "success",
    "data": [
        { "id": 1, "filename": "123-file1.jpg", "path": "src/uploads/123-file1.jpg", "userId": 1, "createdAt": "2025-03-13T00:00:00.000Z" },
        { "id": 2, "filename": "456-file2.jpg", "path": "src/uploads/456-file2.jpg", "userId": 1, "createdAt": "2025-03-13T00:00:00.000Z" }
    ]
}
GET /api/files
Get all files for the authenticated user.
Response (200):
json

  

 

Copy
{
    "status": "success",
    "data": [
        { "id": 1, "filename": "123-file1.jpg", "path": "src/uploads/123-file1.jpg", "userId": 1, "createdAt": "2025-03-13T00:00:00.000Z" }
    ]
}
DELETE /api/files/:id
Delete a file by ID.
Response (200):
json

  

 

Copy
{
    "status": "success",
    "message": "File deleted successfully"
}
Messaging (Authenticated)
GET /api/messages
Get all messages where the user is sender or receiver.
Response (200):
json

  

 

Copy
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "content": "Hello there!",
            "senderId": 1,
            "receiverId": 2,
            "createdAt": "2025-03-13T00:00:00.000Z",
            "sender": { "id": 1, "email": "user1@example.com", "name": "John" },
            "receiver": { "id": 2, "email": "user2@example.com", "name": "Jane" }
        }
    ]
}
POST /api/messages/send
Send a message (also triggers Socket.IO).
Request Body:
json

  

 

Copy
{
    "receiverId": 2,
    "content": "Hello there!"
}
Response (201):
json

  

 

Copy
{
    "status": "success",
    "data": {
        "id": 1,
        "content": "Hello there!",
        "senderId": 1,
        "receiverId": 2,
        "createdAt": "2025-03-13T00:00:00.000Z"
    }
}
Error Responses
404 Not Found:
json

  

 

Copy
{
    "status": "error",
    "message": "Route GET /api/unknown not found"
}
500 Internal Server Error:
json

  

 

Copy
{
    "status": "error",
    "message": "Internal Server Error"
}
💬 Real-Time Messaging with Socket.IO
Enable real-time communication between users:

javascript

  

 

Copy
const socket = io('http://localhost:3000');

// Join your room
socket.emit('join', userId);

// Send a message
socket.emit('sendMessage', { senderId, receiverId, content });

// Receive messages
socket.on('newMessage', (message) => {
    console.log('New message:', message);
});
Messages are stored in the database with senderId and receiverId, linked to the User model, and broadcast in real-time to both parties.

🛠 Custom Import Aliases
Enjoy Next.js-style imports with the @/ prefix:

javascript

  

 

Copy
const prisma = require('@/config/database');
const { getUserMessages } = require('@/controllers/messageController');
Enabled via module-alias and jsconfig.json for seamless IDE support.

✅ Code Quality with ESLint
Linting is set up with a Next.js-inspired configuration:

Run npm run lint to check for issues:
bash

  

 

Copy
npm run lint
Run npm run lint:fix to auto-fix problems:
bash

  

 

Copy
npm run lint:fix
Rules include single quotes, semicolons, and Prettier formatting for consistency.

🤝 Contributing
We welcome contributions to make this boilerplate even better!

Fork the repository.
Create a feature branch:
bash

  

 

Copy
git checkout -b feature/awesome-idea
Commit your changes:
bash

  

 

Copy
git commit -m "Add awesome idea"
Push to the branch:
bash

  

 

Copy
git push origin feature/awesome-idea
Open a Pull Request!
📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
