import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import { SERVER_URL } from '../config';

function PatientDashboard() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Vitals state
  const [symptoms, setSymptoms] = useState('');
  const [autoSend, setAutoSend] = useState(false);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('document');
  const [fileDescription, setFileDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  
  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (autoSend && isRegistered) {
      intervalRef.current = setInterval(() => {
        sendVitals();
      }, 5000); // Send every 5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSend, isRegistered]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (patientId && patientName && socket) {
      socket.emit('patient-join', { patientId, name: patientName });
      setIsRegistered(true);
    }
  };

  const generateVitals = () => {
    return {
      patientId: patientId,
      heartRate: 60 + Math.floor(Math.random() * 50),
      oxygenLevel: 90 + Math.floor(Math.random() * 10),
      temperature: 36.0 + (Math.random() * 2.0),
      symptoms: symptoms,
      timestamp: new Date().toISOString()
    };
  };

  const sendVitals = () => {
    if (socket && isRegistered) {
      const vitalsData = generateVitals();
      socket.emit('send-vitals', vitalsData);
      console.log('Sent vitals:', vitalsData);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large! Maximum size is 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('patientId', patientId);
    formData.append('fileType', fileType);
    formData.append('description', fileDescription);

    try {
      setUploadProgress('Uploading...');
      const response = await axios.post(`${SERVER_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadProgress('Upload successful!');
        
        // Notify via socket
        socket.emit('file-uploaded', response.data.file);
        
        // Reset form
        setSelectedFile(null);
        setFileDescription('');
        setFileType('document');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        setTimeout(() => setUploadProgress(null), 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress('Upload failed!');
      setTimeout(() => setUploadProgress(null), 3000);
    }
  };

  if (!isRegistered) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <Link to="/" className="back-btn">← Back</Link>
          <h1>🤒 Patient Dashboard</h1>
        </header>
        <div className="registration-form">
          <h2>Patient Registration</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Patient ID:</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter your ID (e.g., 101)"
                required
              />
            </div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={!isConnected}>
              {isConnected ? 'Connect to Doctor' : 'Connecting...'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <Link to="/" className="back-btn">← Back</Link>
        <h1>🤒 Patient Dashboard</h1>
        <div className="patient-id-badge">Patient {patientId} - {patientName}</div>
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>

      <div className="dashboard-content">
        {/* Vitals Section */}
        <div className="section vitals-control">
          <h2>❤️ Vital Signs Monitor</h2>
          
          <div className="form-group">
            <label>Current Symptoms:</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms (optional)"
              rows="3"
            />
          </div>

          <div className="vitals-controls">
            <button onClick={sendVitals} className="send-btn" disabled={!isConnected}>
              📤 Send Vitals Now
            </button>
            
            <label className="auto-send-toggle">
              <input
                type="checkbox"
                checked={autoSend}
                onChange={(e) => setAutoSend(e.target.checked)}
              />
              Auto-send every 5 seconds
            </label>
          </div>

          {autoSend && (
            <div className="auto-send-indicator">
              🔄 Auto-sending vitals...
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="section file-upload-section">
          <h2>📁 Upload Medical Files</h2>
          <form onSubmit={handleFileUpload} className="upload-form">
            <div className="form-group">
              <label>Select File:</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
              />
              {selectedFile && (
                <p className="selected-file">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="form-group">
              <label>File Type:</label>
              <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                <option value="document">Document</option>
                <option value="lab_report">Lab Report</option>
                <option value="xray">X-Ray</option>
                <option value="image">Medical Image</option>
                <option value="prescription">Prescription</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Describe this file..."
                rows="2"
                required
              />
            </div>

            <button type="submit" className="upload-btn" disabled={!selectedFile || !isConnected}>
              ⬆️ Upload File
            </button>

            {uploadProgress && (
              <div className={`upload-status ${uploadProgress.includes('successful') ? 'success' : uploadProgress.includes('failed') ? 'error' : ''}`}>
                {uploadProgress}
              </div>
            )}
          </form>
        </div>

        {/* Instructions */}
        <div className="section info-section">
          <h3>ℹ️ Instructions</h3>
          <ul>
            <li>Click "Send Vitals Now" to send your current health data to the doctor</li>
            <li>Enable auto-send to continuously monitor your vitals</li>
            <li>Upload medical documents, lab reports, or images for doctor review</li>
            <li>Maximum file size: 10MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
