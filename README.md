# Full-Stack Blogging Platform

This project is a full-stack blogging platform built with:

- React frontend
- Node.js + Express backend
- MongoDB database
- JWT-based authentication
- Docker support for local development

## Project Structure

```text
Content_managment/
  backend/
  frontend/
  docker-compose.yml
  README.md
```

## Features

- User signup and login with JWT
- Create, edit, delete blog posts
- Public home page for all blog posts
- Comment system on blog posts
- Dashboard for managing your posts
- Admin controls for deleting posts and users
- MVC backend structure with validation and error handling

## Local Setup

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` as needed. For local MongoDB:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_platform
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Default frontend environment:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 3. Create an admin user

Newly registered users are regular users by default. To promote one user to admin, update that document in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Docker Setup

From the project root:

```bash
docker compose up --build
```

Services:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)
- MongoDB: `mongodb://localhost:27017`

For Docker, set `backend/.env` to:

```env
PORT=5000
MONGO_URI=mongodb://mongodb:27017/blog_platform
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Posts

- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

### Comments

- `POST /api/comments/post/:postId`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`

### Admin

- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`
- `DELETE /api/admin/posts/:id`
