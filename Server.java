import java.io.*;
import java.net.*;

public class Server {
    public static void main(String[] args) {
        int port = 9090; // Ensure this matches Client port!
        
        System.out.println("Doctor's Terminal Running on port " + port + "...");

        try (ServerSocket serverSocket = new ServerSocket(port)) {
            while (true) {
                Socket socket = serverSocket.accept();
                System.out.println(">>> Patient Connected!");

                ObjectInputStream in = new ObjectInputStream(socket.getInputStream());

                try {
                    while (true) {
                        Vitals data = (Vitals) in.readObject();
                        
                        // Print the Data nicely
                        System.out.println("------------------------------------------------");
                        System.out.println("PATIENT " + data.patientId + " REPORT:");
                        System.out.println("   Heart Rate: " + data.heartRate + " bpm");
                        System.out.println("   Oxygen:     " + data.oxygenLevel + "%");
                        System.out.println("   MESSAGE:    " + data.message); // <--- The Chat Part
                        System.out.println("------------------------------------------------");

                        // Alerts
                        if (data.heartRate > 100) System.out.println("   *** WARNING: High Heart Rate ***");
                        if (data.oxygenLevel < 95) System.out.println("   *** WARNING: Low Oxygen ***");
                    }
                } catch (Exception e) {
                    System.out.println("Patient disconnected.");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}