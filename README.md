
# 📱 Chat Application

A full-stack **real-time chat app** with features like messaging, typing indicators, message seen status, online presence, and peer-to-peer voice/video calling — built using **React**, **Express**, **Socket.IO**, and **MongoDB**.

🌐 **Live Demo**: [chat-app-client-bb5p.onrender.com](https://chat-app-client-bb5p.onrender.com)

---

## 🛠 Tech Stack

**Frontend** (`fe/chat-app`):
- React
- Socket.IO Client
- Tailwind CSS / CSS Modules
- Audio/Video support (custom ringtones, loaders, gifs)

**Backend** (`be`):
- Node.js + Express
- MongoDB (Mongoose)
- Socket.IO Server
- JWT Authentication
- Cloudinary (for media)
- LiveKit Integration (for video calling)

---

## ✨ Features

- ✅ Real-time text chat
- 🟢 Online user tracking
- 🧑‍💻 Typing indicators
- 👁️ Message read (seen) status
- 📞 Call Initiation + Acceptance + Rejection
- 🔔 Custom audio/video feedback for call and message events
- 🖼️ Cloudinary support for media
- 🔐 JWT-based user authentication

---

## 📁 Project Structure

```bash
ChatApplication/
│
├── be/                     # Backend
│   ├── controller/         # Auth, user, message logic
│   ├── lib/                # Helpers (DB, JWT, socket, cloudinary, livekit)
│   ├── model/              # Mongoose models
│   ├── routes/             # API & Auth Routes
│   ├── index.js            # Entry point for Express server
│   └── .env                # Environment variables
│
└── fe/chat-app/            # Frontend
    ├── public/             # Public assets
    ├── src/
    │   ├── assets/         # Gifs, mp3, video loaders
    │   ├── components/     # Reusable UI components
    │   ├── store/          # Global state store
    │   ├── App.jsx         # App root
    │   └── main.jsx        # Entry point
```

---

## 🚀 Getting Started

### 🔧 Backend Setup

```bash
cd be
npm install
# Add .env with required secrets
npm start
```

### 💻 Frontend Setup

```bash
cd fe/chat-app
npm install
npm run dev
```

---

## 🌍 Environment Variables

Example `.env` for backend:

```env
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 📸 Screenshots

### 🔐 Login Page
![Login Page](./screenshots/login.png)

### 💬 Chat Interface
![Chat Interface](./screenshots/chat.png)

### 📞 Incoming Call
![Incoming Call](./screenshots/incoming-call.png)

### 📤 Outgoing Call
![Outgoing Call](./screenshots/outgoing-call.png)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
