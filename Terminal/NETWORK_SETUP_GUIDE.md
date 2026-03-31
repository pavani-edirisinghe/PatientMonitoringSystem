# Network Setup Guide - Running Client and Server on Different Laptops

## 🌐 Overview
This guide explains how to run the Patient Monitoring System with:
- **SERVER laptop**: Runs the backend (Node.js server + Doctor Dashboard)
- **CLIENT laptop**: Runs the frontend (Patient Dashboard)

## 📋 Prerequisites
Both laptops must be:
1. Connected to the **same WiFi network**
2. Have Node.js installed
3. Able to ping each other

---

## 🖥️ SERVER LAPTOP SETUP

### Step 1: Install Dependencies
```bash
cd /home/hasith-heshika/Documents/GitHub/PatientMonitoringSystem/web/server
npm install
```

### Step 2: Start the Server
```bash
node server.js
```

### Step 3: Note the Server IP Address
When the server starts, you'll see output like:
```
🏥 Patient Monitoring Server running on http://localhost:8888
📡 WebSocket server ready for connections

🌐 Network Access:
   http://192.168.1.100:8888
   http://10.0.0.5:8888

💡 Use one of these IP addresses on the CLIENT laptop
```

**IMPORTANT:** Write down one of these IP addresses (e.g., `192.168.1.100`)

### Step 4: Open Doctor Dashboard (on SERVER laptop)
Open your browser and go to:
```
http://localhost:3333
```
Click "Doctor Dashboard"

---

## 💻 CLIENT LAPTOP SETUP

### Step 1: Copy the Project
Transfer the entire project folder to the CLIENT laptop, OR clone it from Git.

### Step 2: Install Dependencies
```bash
cd PatientMonitoringSystem/web/client
npm install
```

### Step 3: Configure Server IP
Edit the file: `src/config.js`

```javascript
// Change this line:
export const SERVER_IP = 'localhost';

// To the SERVER laptop's IP address:
export const SERVER_IP = '192.168.1.100'; // Use the IP from SERVER laptop
```

### Step 4: Start the Client
```bash
PORT=3333 npm start
```

Or if port 3333 is busy:
```bash
PORT=3000 npm start
```

### Step 5: Open Patient Dashboard
Open your browser and go to:
```
http://localhost:3333
```
Click "Patient Dashboard"

---

## 🔧 Alternative: Manual IP Configuration

If you prefer to manually find the SERVER laptop's IP:

### On Windows (SERVER laptop):
```cmd
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g., 192.168.1.100)

### On Linux/Mac (SERVER laptop):
```bash
ip addr show
# OR
ifconfig
```
Look for inet address under wlan0 or en0 (e.g., 192.168.1.100)

### On Mac (SERVER laptop):
```bash
ifconfig en0 | grep inet
```

---

## 🧪 Testing the Connection

### 1. Test Server Accessibility (from CLIENT laptop)
Open browser and go to:
```
http://192.168.1.100:8888/api/health
```
You should see:
```json
{"status":"OK","doctors":0,"patients":0}
```

### 2. Test WebSocket Connection
On CLIENT laptop, open browser console (F12) when loading the Patient Dashboard.
You should see:
```
🔗 Connecting to server: http://192.168.1.100:8888
```

---

## 🚀 Full Workflow

### On SERVER Laptop:
1. Start backend server: `node server.js`
2. Note the IP address shown
3. Open browser → http://localhost:3333 → "Doctor Dashboard"

### On CLIENT Laptop:
1. Update `src/config.js` with SERVER's IP
2. Start React app: `PORT=3333 npm start`
3. Open browser → http://localhost:3333 → "Patient Dashboard"
4. Register as a patient
5. Send vitals and files

### Verify:
- CLIENT sends vitals → SERVER's Doctor Dashboard shows them in real-time
- CLIENT uploads files → SERVER receives and displays them

---

## 🐛 Troubleshooting

### Problem: "Connecting..." never stops on CLIENT
**Solution:**
1. Check if SERVER laptop's firewall is blocking port 8888
2. Verify CORS is enabled (should be after updates)
3. Check if both laptops are on same network
4. Verify the IP address in `config.js` is correct

### Problem: Cannot reach http://SERVER_IP:8888/api/health
**Solution:**
1. Make sure server is running on SERVER laptop
2. Check firewall settings on SERVER laptop
3. Try pinging SERVER laptop from CLIENT: `ping 192.168.1.100`

### Problem: WebSocket connection fails
**Solution:**
1. Check browser console for errors (F12)
2. Verify server is listening on 0.0.0.0 (all interfaces)
3. Ensure no VPN is interfering

### Firewall Configuration (if needed):

#### Ubuntu/Linux:
```bash
sudo ufw allow 8888
sudo ufw reload
```

#### Windows:
Go to Windows Firewall → Allow an app → Add port 8888

#### Mac:
System Preferences → Security & Privacy → Firewall Options → Add port 8888

---

## 📊 Network Architecture

```
CLIENT Laptop                          SERVER Laptop
┌─────────────────┐                   ┌─────────────────┐
│                 │                   │                 │
│  React App      │  WebSocket/HTTP   │  Node.js        │
│  (Port 3333)    │ ◄──────────────►  │  (Port 8888)    │
│                 │                   │                 │
│  Patient        │                   │  Doctor         │
│  Dashboard      │                   │  Dashboard      │
│                 │                   │                 │
└─────────────────┘                   └─────────────────┘
        │                                     │
        └─────────── Same WiFi Network ──────┘
```

---

## 📝 Quick Reference

### SERVER Laptop Commands:
```bash
# 1. Start server
cd web/server
node server.js

# 2. Get IP address
ip addr show  # Linux
ipconfig      # Windows
ifconfig      # Mac
```

### CLIENT Laptop Commands:
```bash
# 1. Edit config
nano web/client/src/config.js
# Change: export const SERVER_IP = '192.168.1.100';

# 2. Start client
cd web/client
PORT=3333 npm start
```

### Testing URLs:
- **Health Check**: http://SERVER_IP:8888/api/health
- **Doctor Dashboard**: http://localhost:3333 (on SERVER)
- **Patient Dashboard**: http://localhost:3333 (on CLIENT)

---

## ✅ Success Indicators

When everything is working correctly:
1. ✅ SERVER shows: "WebSocket server ready for connections"
2. ✅ CLIENT shows: "🟢 Connected" in Patient Dashboard
3. ✅ Vitals sent from CLIENT appear on SERVER's Doctor Dashboard
4. ✅ Files uploaded from CLIENT appear on SERVER
5. ✅ No console errors in browser (F12)

---

## 🎯 Production Deployment (Optional)

For deploying on actual production servers:
1. Use environment variables instead of config.js
2. Enable HTTPS/WSS (secure WebSocket)
3. Add authentication
4. Use proper DNS names instead of IP addresses
5. Configure reverse proxy (nginx/Apache)

Good luck with your network programming project! 🚀
