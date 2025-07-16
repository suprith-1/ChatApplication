
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
<img width="1893" height="968" alt="image" src="https://github.com/user-attachments/assets/8b32ec7d-02da-4b4f-b3d8-0d040afcf281" />


### 💬 Chat Interface
<img width="1388" height="800" alt="image" src="https://github.com/user-attachments/assets/8d6c1586-b458-4c94-9956-d70d944bf85e" />


### 📞 Incoming Call
<img width="386" height="427" alt="image" src="https://github.com/user-attachments/assets/d3cfb03a-ec32-4e84-acd2-348460ee4ec7" />


### 📤 Outgoing Call
<img width="565" height="647" alt="image" src="https://github.com/user-attachments/assets/3230cb26-156e-4e68-b942-868e162f650f" />


---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
