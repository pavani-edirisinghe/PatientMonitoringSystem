import java.io.*;
import java.net.*;
import java.util.Random;
import java.util.Scanner; // <--- NEW

public class Client {
    public static void main(String[] args) {
        String serverAddress = "localhost";
        int port = 9090; // Make sure this matches your server port!
        int patientId = 101;

        try (Socket socket = new Socket(serverAddress, port);
             Scanner scanner = new Scanner(System.in)) { // <--- Input scanner
            
            System.out.println("Connected to Doctor! Type your symptoms below.");

            ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
            Random rand = new Random();

            while (true) {
                // 1. Generate Sensor Data (Automatic)
                int hr = 60 + rand.nextInt(50);
                double temp = 36.0 + (rand.nextDouble() * 2.0);
                int spo2 = 90 + rand.nextInt(10);

                // 2. Ask User for a Message (Manual Chat)
                System.out.print("Enter symptom (or press Enter to skip): ");
                String note = scanner.nextLine(); 

                // 3. Create and Send Packet
                Vitals currentVitals = new Vitals(patientId, temp, hr, spo2, note);
                out.writeObject(currentVitals);
                out.flush();

                System.out.println(">>> Sent to Doctor: " + note);
            }

        } catch (Exception e) {
            System.out.println("Connection Error: " + e.getMessage());
        }
    }
}