# 📝 Blogger — Full-Stack Web Application

A modern full-stack blogging platform built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 🚀 Features

- **JWT Authentication** — Register, Login, Logout
- **Blog Posts** — Create, Read, Update, Delete
- **Likes & Comments** — Engage with posts
- **Search & Pagination** — Find posts easily
- **Dashboard** — Manage your posts + stats
- **Profile** — Edit your name, bio, avatar
- **Protected Routes** — Auth-gated pages
- **Responsive UI** — Mobile + Desktop

---

## 📁 Project Structure

```
Blogger website/
├── backend/
│   ├── config/        # MongoDB connection
│   ├── controllers/   # Route logic
│   ├── middleware/    # JWT auth
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── server.js      # Express entry
│   └── .env           # Environment vars
│
└── frontend/
    └── src/
        ├── components/ # Navbar, PostCard, etc.
        ├── context/    # Auth state
        ├── pages/      # All pages
        └── services/   # Axios API calls
```

---

## ⚙️ Setup & Run

### 1. Backend

```bash
cd backend
npm install
```

Edit `.env` with your MongoDB URI:
```
MONGO_URI=mongodb://localhost:27017/blogger
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the server:
```bash
npm run dev       # development (nodemon)
npm start         # production
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Open: **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register user |
| POST | /api/auth/login | ❌ | Login user |
| GET | /api/posts | ❌ | Get all posts (search, paginate) |
| GET | /api/posts/:id | ❌ | Get single post |
| POST | /api/posts | ✅ | Create post |
| PUT | /api/posts/:id | ✅ | Update post |
| DELETE | /api/posts/:id | ✅ | Delete post |
| PUT | /api/posts/:id/like | ✅ | Like/Unlike post |
| POST | /api/posts/:id/comments | ✅ | Add comment |
| DELETE | /api/posts/:id/comments/:cid | ✅ | Delete comment |
| GET | /api/users/profile | ✅ | Get my profile |
| PUT | /api/users/profile | ✅ | Update profile |

---

## 🛡️ Security Notes

- `.env` is in `.gitignore` — never commit it
- Passwords are hashed with **bcryptjs**
- JWT tokens expire in **7 days**
- Only post authors can edit/delete their posts
