# 🏥 Patient Monitoring System - Web Application

## ✅ Implementation Complete!

Your Patient Monitoring System has been successfully converted to a modern web application!

## 🚀 What's Running

### Backend Server (Node.js + Express + Socket.io)
- **Port**: 8888
- **URL**: http://localhost:8888
- **Status**: ✅ Running
- **Features**: WebSocket communication, file uploads, real-time data streaming

### Frontend (React)
- **Port**: 3333  
- **URL**: http://localhost:3333
- **Status**: ✅ Running
- **Features**: Doctor dashboard, Patient dashboard, real-time monitoring

## 📱 How to Access

### Open the Web Application
1. Open your browser
2. Go to: **http://localhost:3333**
3. You'll see the home page with two options:
   - **Doctor Dashboard** - For monitoring patients
   - **Patient Dashboard** - For patients to send vitals and files

### Testing the Application

#### As a Doctor:
1. Click "Doctor Dashboard"
2. You'll see three sections:
   - **Connected Patients** - Shows all registered patients
   - **Real-time Vitals Monitor** - Live stream of patient vitals
   - **Received Files** - All uploaded medical files
3. Leave this tab open to receive data

#### As a Patient:
1. Open a **new tab** (http://localhost:3333)
2. Click "Patient Dashboard"
3. Register with:
   - Patient ID: `101` (or any number)
   - Name: Your name
4. Click "Connect to Doctor"
5. Now you can:
   - **Send Vitals**: Enter symptoms and click "Send Vitals Now"
   - **Auto-send**: Enable checkbox for continuous monitoring (every 5 seconds)
   - **Upload Files**: Select a file, choose type, add description, and upload

#### Testing File Upload:
You can use the sample files in the project:
- `/home/hasith-heshika/Documents/GitHub/PatientMonitoringSystem/sample_lab_report.txt`
- `/home/hasith-heshika/Documents/GitHub/PatientMonitoringSystem/patient_notes.txt`

## 🎯 Features Implemented

### ✅ Real-time Communication
- WebSocket-based bidirectional communication
- Instant vitals updates on doctor dashboard
- Live patient connection status

### ✅ Vitals Monitoring
- Random generation of heart rate, SpO2, temperature
- Automatic warnings for abnormal values:
  - ⚠️ Heart Rate > 100 bpm
  - ⚠️ Oxygen < 95%
  - ⚠️ Temperature > 38°C
- Symptom text reporting

### ✅ File Transfer Protocol  
- Upload medical files (images, documents, lab reports, X-rays)
- File size limit: 10MB
- Patient-specific file organization
- Download files from doctor dashboard
- File metadata tracking

### ✅ Multi-client Support
- Server handles multiple patients simultaneously
- Multiple doctor dashboards can connect
- All doctors receive all patient data

## 📂 Project Structure

```
PatientMonitoringSystem/
├── Client.java                    # Original Java client
├── Server.java                    # Original Java server
├── Vitals.java
├── FileTransferData.java
└── web/                           # NEW WEB APPLICATION
    ├── server/                    # Backend (Node.js)
    │   ├── server.js              # Main server file
    │   ├── package.json
    │   └── uploads/               # Uploaded files storage
    └── client/                    # Frontend (React)
        ├── public/
        │   └── index.html
        ├── src/
        │   ├── App.js             # Main routing
        │   ├── index.js
        │   ├── pages/
        │   │   ├── DoctorDashboard.js
        │   │   └── PatientDashboard.js
        │   └── styles/
        │       ├── index.css
        │       ├── App.css
        │       └── Dashboard.css
        └── package.json
```

## 🔧 Managing the Application

### Stop the Servers
If you need to stop the servers:
```bash
# Kill backend
pkill -f "node server.js"

# Kill frontend  
pkill -f "react-scripts"
```

### Restart the Servers

#### Backend:
```bash
cd /home/hasith-heshika/Documents/GitHub/PatientMonitoringSystem/web/server
node server.js
```

#### Frontend:
```bash
cd /home/hasith-heshika/Documents/GitHub/PatientMonitoringSystem/web/client
PORT=3333 npm start
```

## 🎨 UI Features

- **Modern gradient design** with purple/pink theme
- **Responsive layout** - works on desktop and mobile
- **Real-time indicators** - green dot when connected
- **Color-coded alerts** - warnings appear in orange
- **Auto-scroll** - vitals stream shows latest data first
- **File preview** - shows file metadata before download

## 📊 Network Programming Concepts Demonstrated

1. **Real-time Bidirectional Communication** - WebSocket (Socket.io)
2. **File Transfer Protocol** - HTTP multipart/form-data with Multer
3. **Multi-threaded Server** - Node.js event-driven architecture
4. **Client-Server Architecture** - REST API + WebSocket
5. **Network Protocols** - HTTP, WebSocket (WS)

## 🎓 Project Requirements Met

✅ Network programming application  
✅ Real-time communication between multiple clients  
✅ Data exchange (vitals, symptoms, files)  
✅ File Transfer Protocol implementation  
✅ Multi-client support  
✅ IP-based communication  
✅ Modern web interface (NOT chat application)  

## 📝 Notes

- Uploaded files are stored in: `web/server/uploads/Patient_XXX/`
- React app has some minor warnings (unused variables) - these don't affect functionality
- CORS is configured for localhost - update for production deployment
- No database is used - data is stored in memory (resets on server restart)

## 🌐 Access URLs

- **Web Application**: http://localhost:3333
- **Backend API**: http://localhost:8888
- **Health Check**: http://localhost:8888/api/health

Enjoy your modern Patient Monitoring System! 🎉
