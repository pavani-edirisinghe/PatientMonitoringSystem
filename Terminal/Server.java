import java.io.*;
import java.net.*;

public class Server {
    public static void main(String[] args) {
        int port = 9090;
        System.out.println("Doctor's Terminal Running on port " + port + "...");

        try (ServerSocket serverSocket = new ServerSocket(port)) {

            while (true) {
                Socket socket = serverSocket.accept();
                System.out.println(">>> New Patient Connected from IP: " + socket.getInetAddress().getHostAddress());

                ClientHandler clientHandler = new ClientHandler(socket);
                new Thread(clientHandler).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class ClientHandler implements Runnable {
    private Socket socket;
    private static final String RECEIVED_FILES_DIR = "ReceivedFiles";
    private ObjectOutputStream out; // To send data back to the client
    private ObjectInputStream in; // To receive data from the client

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try {
            // Order is important: create output stream first, then input stream.
            out = new ObjectOutputStream(socket.getOutputStream());
            in = new ObjectInputStream(socket.getInputStream());

            while (true) {
                Object obj = in.readObject();

                if (obj instanceof Vitals) {
                    handleVitals((Vitals) obj);
                } else if (obj instanceof FileTransferData) {
                    handleFileTransfer((FileTransferData) obj);
                }
            }
        } catch (EOFException e) {
            System.out.println("Patient disconnected.");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            try {
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void handleVitals(Vitals data) {
        System.out.println("------------------------------------------------");
        System.out.println("PATIENT " + data.patientId + " REPORT:");
        System.out.println("   Heart Rate: " + data.heartRate + " bpm");
        System.out.println("   Oxygen:     " + data.oxygenLevel + "%");
        System.out.println("   MESSAGE:    " + data.message);
        System.out.println("------------------------------------------------");

        if (data.heartRate > 100)
            System.out.println("   *** WARNING: High Heart Rate ***");
        if (data.oxygenLevel < 95)
            System.out.println("   *** WARNING: Low Oxygen ***");

        // New: Prompt doctor for advice and send it back
        try {
            Scanner scanner = new Scanner(System.in);
            System.out.print("Enter advice for patient " + data.patientId + ": ");
            String advice = scanner.nextLine();
            System.out.print("Enter prescription for patient " + data.patientId + ": ");
            String prescription = scanner.nextLine();

            DoctorAdvice doctorAdvice = new DoctorAdvice(advice, prescription);
            out.writeObject(doctorAdvice);
            out.flush();
            System.out.println(">>> Advice sent to patient " + data.patientId);

        } catch (IOException e) {
            System.out.println("Error sending advice: " + e.getMessage());
        }
    }

    private void handleFileTransfer(FileTransferData fileData) {
        try {
            // Create directory structure: ReceivedFiles/Patient_XXX/
            File patientDir = new File(RECEIVED_FILES_DIR + "/Patient_" + fileData.patientId);
            if (!patientDir.exists()) {
                patientDir.mkdirs();
            }

            // Save the file
            String filePath = patientDir.getPath() + "/" + fileData.fileName;
            FileOutputStream fos = new FileOutputStream(filePath);
            fos.write(fileData.fileContent);
            fos.close();

            System.out.println("================================================");
            System.out.println("FILE RECEIVED FROM PATIENT " + fileData.patientId);
            System.out.println("   File Name:   " + fileData.fileName);
            System.out.println("   File Size:   " + fileData.fileSize + " bytes");
            System.out.println("   File Type:   " + fileData.fileType);
            System.out.println("   Description: " + fileData.description);
            System.out.println("   Saved to:    " + filePath);
            System.out.println("================================================");

        } catch (IOException e) {
            System.out.println("Error saving file: " + e.getMessage());
        }
    }
}