import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import { SERVER_URL } from '../config';

function DoctorDashboard() {
  const [socket, setSocket] = useState(null);
  const [patients, setPatients] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [fileHistory, setFileHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      newSocket.emit('doctor-join');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Listen for patient connections
    newSocket.on('patient-connected', (patientInfo) => {
      setPatients(prev => [...prev, patientInfo]);
      console.log('Patient connected:', patientInfo);
    });

    // Listen for patient disconnections
    newSocket.on('patient-disconnected', (patientInfo) => {
      setPatients(prev => prev.filter(p => p.socketId !== patientInfo.socketId));
      console.log('Patient disconnected:', patientInfo);
    });

    // Listen for vitals updates
    newSocket.on('vitals-update', (vitalsData) => {
      setVitalsHistory(prev => [vitalsData, ...prev].slice(0, 50)); // Keep last 50
    });

    // Listen for file uploads
    newSocket.on('file-received', (fileData) => {
      setFileHistory(prev => [fileData, ...prev]);
    });

    // Listen for initial patients list
    newSocket.on('patients-list', (patientsList) => {
      setPatients(patientsList);
    });

    return () => newSocket.close();
  }, []);

  const getVitalStatus = (vitals) => {
    const warnings = [];
    if (vitals.heartRate > 100) warnings.push('High HR');
    if (vitals.oxygenLevel < 95) warnings.push('Low O2');
    if (vitals.temperature > 38.0) warnings.push('Fever');
    return warnings;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <Link to="/" className="back-btn">← Back</Link>
        <h1>👨‍⚕️ Doctor Dashboard</h1>
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>

      <div className="dashboard-content">
        {/* Connected Patients */}
        <div className="section">
          <h2>Connected Patients ({patients.length})</h2>
          <div className="patients-list">
            {patients.length === 0 ? (
              <p className="empty-state">No patients connected</p>
            ) : (
              patients.map((patient) => (
                <div key={patient.socketId} className="patient-card">
                  <div className="patient-info">
                    <strong>Patient ID: {patient.patientId}</strong>
                    <span>{patient.name}</span>
                    <small>Connected: {new Date(patient.connectedAt).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vitals Monitor */}
        <div className="section vitals-section">
          <h2>📊 Real-time Vitals Monitor</h2>
          <div className="vitals-stream">
            {vitalsHistory.length === 0 ? (
              <p className="empty-state">Waiting for vitals data...</p>
            ) : (
              vitalsHistory.map((vitals, index) => {
                const warnings = getVitalStatus(vitals);
                const hasWarning = warnings.length > 0;
                
                return (
                  <div key={index} className={`vital-card ${hasWarning ? 'warning' : ''}`}>
                    <div className="vital-header">
                      <strong>Patient {vitals.patientId}</strong>
                      <span className="vital-time">{new Date(vitals.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="vital-readings">
                      <div className="reading">
                        <span className="label">❤️ Heart Rate:</span>
                        <span className={vitals.heartRate > 100 ? 'alert' : ''}>{vitals.heartRate} bpm</span>
                      </div>
                      <div className="reading">
                        <span className="label">🫁 Oxygen:</span>
                        <span className={vitals.oxygenLevel < 95 ? 'alert' : ''}>{vitals.oxygenLevel}%</span>
                      </div>
                      <div className="reading">
                        <span className="label">🌡️ Temp:</span>
                        <span className={vitals.temperature > 38 ? 'alert' : ''}>{vitals.temperature.toFixed(1)}°C</span>
                      </div>
                    </div>
                    {vitals.symptoms && (
                      <div className="vital-symptoms">
                        <strong>Symptoms:</strong> {vitals.symptoms}
                      </div>
                    )}
                    {hasWarning && (
                      <div className="warning-badges">
                        {warnings.map((w, i) => (
                          <span key={i} className="warning-badge">⚠️ {w}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* File Transfers */}
        <div className="section files-section">
          <h2>📁 Received Files</h2>
          <div className="files-list">
            {fileHistory.length === 0 ? (
              <p className="empty-state">No files received yet</p>
            ) : (
              fileHistory.map((file, index) => (
                <div key={index} className="file-card">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <strong>{file.fileName}</strong>
                    <div className="file-meta">
                      <span>Patient {file.patientId}</span>
                      <span>•</span>
                      <span>{(file.fileSize / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span>{file.fileType}</span>
                    </div>
                    <p className="file-description">{file.description}</p>
                    <small>{new Date(file.uploadedAt).toLocaleString()}</small>
                  </div>
                  <a 
                    href={`${SERVER_URL}${file.filePath}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    ⬇️ Download
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
