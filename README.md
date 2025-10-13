# LeetCode Progress Tracker

A full-stack web application to track and compare LeetCode progress among users.

## 🌐 Live Demo

- **Frontend**: https://leetcode-tracker-swart.vercel.app/
- **Backend**: https://leetcodetracker-b.onrender.com/

## 🚀 Deployment Configuration

### Frontend (Vercel)
- Deployed at: https://leetcode-tracker-swart.vercel.app/
- Uses environment variable: `VITE_API_URL=https://leetcodetracker-b.onrender.com/api`

### Backend (Render)
- Deployed at: https://leetcodetracker-b.onrender.com/
- Uses CORS configuration to allow frontend domain

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://leetcode-tracker-swart.vercel.app
```

### Frontend (.env.production)
```
VITE_API_URL=https://leetcodetracker-b.onrender.com/api
```

## 📝 Development Setup

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌟 Features

- Add LeetCode users by username or profile URL
- Real-time stats tracking (Total, Easy, Medium, Hard problems)
- Leaderboard with ranking
- Individual and bulk profile refresh
- Responsive design
- Real name display from LeetCode profiles

## 🔄 API Endpoints

- `POST /api/users` - Add new user
- `GET /api/users` - Get all users
- `PUT /api/users/:username/refresh` - Refresh single user
- `PUT /api/users/refresh-all` - Refresh all users
- `DELETE /api/users/:username` - Delete user

## 📦 Tech Stack

- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express, MongoDB
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Database**: MongoDB Atlas