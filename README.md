# Blog Application

A full-stack blog application built with Spring Boot and React, featuring user authentication, blog post management, and a modern UI.

## Features

- 🔐 **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Protected routes and endpoints

- 📝 **Blog Management**
  - Create, read, update, and delete blog posts
  - Rich text editing
  - Author attribution
  - Post listing and filtering

- 👤 **User Features**
  - User profiles
  - Personal blog dashboard
  - Edit and delete own posts
  - View all blogs or personal blogs

- 🎨 **Modern UI**
  - Responsive design
  - Material-UI components
  - Clean and intuitive interface
  - Loading states and error handling

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.5.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React
- Material-UI
- Axios
- React Router
- Context API for state management

## Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- PostgreSQL
- Maven
- npm or yarn

## Getting Started

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/adityaraj5200/Blog-application
cd Blog\ application/backend
```

2. Configure the database
- Create a PostgreSQL database
- Update `application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/blogdb
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Run the backend
```bash
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080/api`

### Frontend Setup

1. Navigate to the frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```
The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Blog Posts
- `GET /api/posts` - Get all blog posts
- `GET /api/posts/{id}` - Get a specific blog post
- `POST /api/posts` - Create a new blog post
- `PUT /api/posts/{id}` - Update a blog post
- `DELETE /api/posts/{id}` - Delete a blog post

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL database URL
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRATION` - JWT token expiration time
- `PORT` - Server port (default: 8080)

### Frontend
- `REACT_APP_API_URL` - Backend API URL
butors and supporters of the project