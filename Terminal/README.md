# Patient Monitoring System with File Transfer

## Overview
A network programming application that enables real-time communication between patients and doctors, with support for:
- **Vital Signs Monitoring**: Heart rate, oxygen levels, temperature
- **Symptom Reporting**: Text-based symptom descriptions
- **File Transfer**: Send medical documents, lab reports, images, X-rays

## Architecture
- **Server.java**: Doctor's terminal (multi-threaded, handles multiple patients)
- **Client.java**: Patient's terminal
- **Vitals.java**: Data class for patient vital signs
- **FileTransferData.java**: Data class for file transfers

## Features

### 1. Real-time Vital Signs Monitoring
- Continuous monitoring of heart rate, SpO2, and temperature
- Automatic warnings for abnormal values (HR > 100, SpO2 < 95%)

### 2. File Transfer Protocol
- Send medical files from patient to doctor
- Supported file types: Images, Documents, Lab Reports, X-rays
- File size limit: 10MB per file
- Files organized in patient-specific folders

## How to Run

### Terminal 1 - Start Server (Doctor's Terminal)
```bash
cd /home/hasith-heshika/Documents/GitHub/PatientMonitoringSystem
javac *.java
java Server
```

### Terminal 2 - Start Client (Patient's Terminal)
```bash
cd /home/hasith-heshika/Documents/GitHub/PatientMonitoringSystem
java Client
```

## Usage

### Patient Menu Options:
1. **Send Vitals & Symptoms**: Share health metrics with doctor
2. **Send Medical File**: Upload documents, images, lab reports
3. **Exit**: Disconnect from doctor

### Sending Files:
- Enter the full file path
- Specify file type (image/document/lab_report/xray/other)
- Add a description for the doctor

### Received Files Location:
Files are saved in: `ReceivedFiles/Patient_XXX/`

## Sample Test Files
- `sample_lab_report.txt`: Example laboratory report
- `patient_notes.txt`: Example patient notes

## Testing the File Transfer
```bash
# In Client terminal, select option 2 and enter:
File path: /home/hasith-heshika/Documents/GitHub/PatientMonitoringSystem/sample_lab_report.txt
File type: lab_report
Description: Blood test results from Feb 2026
```

## Network Configuration
- **Default Port**: 9090
- **Default Server**: localhost
- Modify Client.java to connect to remote servers

## Project Requirements Met
✓ Network programming application
✓ Real-time communication and data exchange
✓ File Transfer Protocol implementation
✓ Multi-client support (threading)
✓ IP-based communication
