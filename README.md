# Patient Monitoring System

A hybrid patient monitoring project with two implementations:
- Java terminal version for socket-based communication and file transfer
- Web version with React + Node.js + Socket.io for real-time dashboards

## Project Structure

```
PatientMonitoringJava/
|- Terminal/            # Java socket application (doctor and patient terminals)
|  |- Server.java
|  |- Client.java
|  |- README.md
|- web/                 # Web application (React frontend + Node backend)
|  |- server/
|  |- client/
|  |- README.md
|- README.md            # This file
```

## Implementations

### 1) Java Terminal Application
Location: `Terminal/`

Main features:
- Real-time patient vitals and symptom sharing
- Doctor-side monitoring of connected patients
- Medical file transfer from patient to doctor
- Multi-client handling with server threads

Quick start:
```bash
cd Terminal
javac *.java
java Server
```

In another terminal:
```bash
cd Terminal
java Client
```

Detailed documentation: see `Terminal/README.md` and `Terminal/NETWORK_SETUP_GUIDE.md`.

### 2) Web Application
Location: `web/`

Main features:
- Doctor and patient dashboards
- Live vitals updates using WebSockets
- File upload/download with metadata
- Automatic alerts for abnormal vital values

Quick start:
```bash
cd web/server
npm install
npm start
```

In another terminal:
```bash
cd web/client
npm install
npm start
```

Detailed documentation: see `web/README.md` and `web/WEB_APPLICATION_GUIDE.md`.

## Default Ports

- Java terminal server: `9090`
- Web backend server: `5000`
- React frontend: `3000`

## Notes

- Keep terminal server and client running in separate terminals.
- For remote/LAN testing, update server IP settings in the relevant client configuration.
- Uploaded files are stored per patient in implementation-specific folders.

## Repository

GitHub: `pavani-edirisinghe/PatientMonitoringSystem`
