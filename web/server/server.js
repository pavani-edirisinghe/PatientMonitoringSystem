const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow all origins for network access
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = 8888;

// Middleware
app.use(cors({
  origin: "*", // Allow all origins
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const patientId = req.body.patientId || 'unknown';
    const dir = `${uploadsDir}/Patient_${patientId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Store connected sockets
let doctorSockets = [];
let patientSockets = [];
let patients = {}; // Store patient data

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Handle doctor connection
  socket.on('doctor-join', () => {
    doctorSockets.push(socket);
    console.log('Doctor connected:', socket.id);
    
    // Send current patients list to doctor
    socket.emit('patients-list', Object.values(patients));
  });

  // Handle patient connection
  socket.on('patient-join', (patientData) => {
    patientSockets.push(socket);
    const patientInfo = {
      socketId: socket.id,
      patientId: patientData.patientId,
      name: patientData.name,
      connectedAt: new Date().toISOString()
    };
    
    patients[socket.id] = patientInfo;
    console.log('Patient connected:', patientInfo);
    
    // Notify all doctors
    doctorSockets.forEach(doc => {
      doc.emit('patient-connected', patientInfo);
    });
  });

  // Handle vitals data from patient
  socket.on('send-vitals', (vitalsData) => {
    console.log('Received vitals:', vitalsData);
    
    // Broadcast to all doctors
    doctorSockets.forEach(doc => {
      doc.emit('vitals-update', vitalsData);
    });
  });

  // Handle file transfer notification
  socket.on('file-uploaded', (fileData) => {
    console.log('File uploaded:', fileData);
    
    // Notify all doctors about new file
    doctorSockets.forEach(doc => {
      doc.emit('file-received', fileData);
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    
    // Remove from doctor list
    doctorSockets = doctorSockets.filter(s => s.id !== socket.id);
    
    // Remove from patient list and notify doctors
    if (patients[socket.id]) {
      const patientInfo = patients[socket.id];
      delete patients[socket.id];
      
      doctorSockets.forEach(doc => {
        doc.emit('patient-disconnected', patientInfo);
      });
    }
    
    patientSockets = patientSockets.filter(s => s.id !== socket.id);
  });
});

// REST API endpoints

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = {
      patientId: req.body.patientId,
      fileName: req.file.originalname,
      savedFileName: req.file.filename,
      fileSize: req.file.size,
      fileType: req.body.fileType,
      description: req.body.description,
      uploadedAt: new Date().toISOString(),
      filePath: `/uploads/Patient_${req.body.patientId}/${req.file.filename}`
    };

    console.log('File saved:', fileData);

    // Notify all doctors via WebSocket
    doctorSockets.forEach(doc => {
      doc.emit('file-received', fileData);
    });

    res.json({ 
      success: true, 
      message: 'File uploaded successfully',
      file: fileData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get patient files
app.get('/api/files/:patientId', (req, res) => {
  const patientDir = `${uploadsDir}/Patient_${req.params.patientId}`;
  
  if (!fs.existsSync(patientDir)) {
    return res.json([]);
  }

  const files = fs.readdirSync(patientDir).map(filename => {
    const stats = fs.statSync(path.join(patientDir, filename));
    return {
      fileName: filename,
      fileSize: stats.size,
      uploadedAt: stats.mtime,
      filePath: `/uploads/Patient_${req.params.patientId}/${filename}`
    };
  });

  res.json(files);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    doctors: doctorSockets.length,
    patients: Object.keys(patients).length 
  });
});

// Get network IP addresses
function getNetworkIPs() {
  const nets = require('os').networkInterfaces();
  const results = [];
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🏥 Patient Monitoring Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`\n🌐 Network Access:`);
  
  const ips = getNetworkIPs();
  if (ips.length > 0) {
    ips.forEach(ip => {
      console.log(`   http://${ip}:${PORT}`);
    });
    console.log(`\n💡 Use one of these IP addresses on the CLIENT laptop`);
  } else {
    console.log(`   No network interfaces found`);
  }
});
