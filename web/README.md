# Patient Monitoring System - Web Application

A modern web-based patient monitoring system with real-time communication and file transfer capabilities.

## 🚀 Features

### Doctor Dashboard
- **Real-time Vital Signs Monitoring**: View patient health data as it arrives
- **Automatic Alerts**: Warnings for abnormal values (HR > 100, SpO2 < 95%, Temp > 38°C)
- **Patient Connection Status**: See all connected patients
- **File Reception**: Receive and download medical documents, lab reports, images
- **Live Updates**: WebSocket-based real-time communication

### Patient Dashboard
- **Patient Registration**: Simple ID and name-based registration
- **Vital Signs Transmission**: 
  - Manual send: Click to send current vitals
  - Auto-send: Automatically send vitals every 5 seconds
- **Symptom Reporting**: Add text descriptions of symptoms
- **File Upload**: 
  - Upload medical documents, lab reports, X-rays, images
  - Support for multiple file types (PDF, images, documents)
  - File size limit: 10MB
  - Add descriptions for each file

## 🛠️ Tech Stack

- **Backend**: Node.js + Express + Socket.io
- **Frontend**: React + React Router
- **Real-time Communication**: WebSocket (Socket.io)
- **File Upload**: Multer
- **HTTP Client**: Axios

## 📁 Project Structure

```
web/
├── server/                 # Backend server
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── uploads/           # Uploaded files storage
└── client/                # React frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   │   ├── DoctorDashboard.js
    │   │   └── PatientDashboard.js
    │   ├── styles/
    │   │   ├── index.css
    │   │   ├── App.css
    │   │   └── Dashboard.css
    │   ├── App.js
    │   └── index.js
    └── package.json       # Frontend dependencies
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Running

#### 1. Install Backend Dependencies
```bash
cd web/server
npm install
```

#### 2. Install Frontend Dependencies
```bash
cd web/client
npm install
```

#### 3. Start the Backend Server
```bash
cd web/server
npm start
# Server runs on http://localhost:5000
```

#### 4. Start the Frontend (in a new terminal)
```bash
cd web/client
npm start
# React app runs on http://localhost:3000
```

## 📖 How to Use

### For Doctors:
1. Open http://localhost:3000
2. Click "Doctor Dashboard"
3. The dashboard will show:
   - Connected patients
   - Real-time vitals stream
   - Received files
4. Files can be downloaded directly from the dashboard

### For Patients:
1. Open http://localhost:3000 (can open multiple tabs for multiple patients)
2. Click "Patient Dashboard"
3. Register with a Patient ID and Name
4. Options:
   - **Send Vitals**: Enter symptoms and click "Send Vitals Now"
   - **Auto-send**: Enable checkbox for continuous monitoring (every 5 seconds)
   - **Upload Files**: Select file, choose type, add description, and upload

## 🔧 Configuration

### Backend (server.js)
- **Port**: 5000 (configurable in `server.js`)
- **CORS**: Configured for http://localhost:3000
- **File Size Limit**: 10MB
- **Upload Directory**: `./uploads`

### Frontend
- **Server URL**: http://localhost:5000 (configurable in dashboard components)
- **Auto-send Interval**: 5 seconds (configurable in PatientDashboard.js)

## 📊 API Endpoints

### REST API
- `POST /api/upload` - Upload medical file
- `GET /api/files/:patientId` - Get patient's uploaded files
- `GET /api/health` - Server health check

### WebSocket Events

#### Client → Server
- `doctor-join` - Doctor connects to system
- `patient-join` - Patient registers with ID and name
- `send-vitals` - Patient sends vital signs data
- `file-uploaded` - Notify about file upload

#### Server → Client
- `patients-list` - List of connected patients
- `patient-connected` - New patient connected
- `patient-disconnected` - Patient disconnected
- `vitals-update` - New vitals data received
- `file-received` - New file uploaded

## 🎨 Features Highlights

### Real-time Monitoring
- Instant vitals display on doctor dashboard
- Color-coded alerts for abnormal values
- Live connection status

### File Transfer
- Multi-type file support (documents, images, lab reports)
- Patient-specific file organization
- Direct download from doctor dashboard
- File metadata tracking (size, type, upload time)

### User Experience
- Clean, modern UI with gradient designs
- Responsive layout (mobile-friendly)
- Visual feedback for all actions
- Auto-scroll for vitals stream

## 🔒 Security Notes

For production deployment, consider:
- Add authentication/authorization
- Use HTTPS
- Implement rate limiting
- Sanitize file uploads
- Add database for persistent storage
- Environment variables for configuration

## 📝 Development

### Backend Development Mode
```bash
cd web/server
npm install -g nodemon
npm run dev
```

### Frontend Development
React auto-reloads on file changes when running `npm start`

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change PORT in server.js (backend)
# Update SERVER_URL in dashboard components (frontend)
```

**WebSocket connection fails:**
- Ensure backend server is running
- Check CORS configuration in server.js
- Verify SERVER_URL in frontend components

**File upload fails:**
- Check file size (max 10MB)
- Ensure uploads directory exists
- Verify multer configuration

## 🤝 Contributing

This is a network programming project demonstrating:
- Real-time bidirectional communication
- File transfer protocol
- Multi-client server architecture
- WebSocket technology
- RESTful APIs

## 📄 License

MIT
