import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import './styles/App.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>🏥 Patient Monitoring System</h1>
        <p>Select your role to continue:</p>
        <div className="role-buttons">
          <Link to="/doctor" className="role-btn doctor-btn">
            👨‍⚕️ Doctor Dashboard
          </Link>
          <Link to="/patient" className="role-btn patient-btn">
            🤒 Patient Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
