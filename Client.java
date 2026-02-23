import java.io.*;
import java.net.*;
import java.nio.file.Files;
import java.util.Random;
import java.util.Scanner; 

public class Client {
    public static void main(String[] args) {
        String serverAddress = "localhost";
        int port = 9090; 
        int patientId = 101;

        try (Socket socket = new Socket(serverAddress, port);
             Scanner scanner = new Scanner(System.in)) {
            
            System.out.println("Connected to Doctor! Patient ID: " + patientId);
            System.out.println("================================================");

            ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
            Random rand = new Random();

            while (true) {
                System.out.println("\n--- Patient Menu ---");
                System.out.println("1. Send Vitals & Symptoms");
                System.out.println("2. Send Medical File");
                System.out.println("3. Exit");
                System.out.print("Choose option: ");
                
                String choice = scanner.nextLine();

                if (choice.equals("1")) {
                    sendVitals(out, scanner, rand, patientId);
                } else if (choice.equals("2")) {
                    sendFile(out, scanner, patientId);
                } else if (choice.equals("3")) {
                    System.out.println("Disconnecting...");
                    break;
                } else {
                    System.out.println("Invalid option!");
                }
            }

        } catch (Exception e) {
            System.out.println("Connection Error: " + e.getMessage());
        }
    }

    private static void sendVitals(ObjectOutputStream out, Scanner scanner, Random rand, int patientId) throws IOException {
        int hr = 60 + rand.nextInt(50);
        double temp = 36.0 + (rand.nextDouble() * 2.0);
        int spo2 = 90 + rand.nextInt(10);

        System.out.print("Enter symptom (or press Enter to skip): ");
        String note = scanner.nextLine(); 

        Vitals currentVitals = new Vitals(patientId, temp, hr, spo2, note);
        out.writeObject(currentVitals);
        out.flush();

        System.out.println(">>> Vitals sent to Doctor!");
        System.out.println("    HR: " + hr + " bpm, SpO2: " + spo2 + "%, Temp: " + String.format("%.1f", temp) + "°C");
    }

    private static void sendFile(ObjectOutputStream out, Scanner scanner, int patientId) throws IOException {
        System.out.print("Enter file path: ");
        String filePath = scanner.nextLine().trim();

        File file = new File(filePath);
        if (!file.exists() || !file.isFile()) {
            System.out.println("Error: File not found!");
            return;
        }

        if (file.length() > 10 * 1024 * 1024) { // 10MB limit
            System.out.println("Error: File too large (max 10MB)");
            return;
        }

        System.out.print("Enter file type (image/document/lab_report/xray/other): ");
        String fileType = scanner.nextLine().trim();

        System.out.print("Enter file description: ");
        String description = scanner.nextLine().trim();

        // Read file content
        byte[] fileContent = Files.readAllBytes(file.toPath());

        FileTransferData fileData = new FileTransferData(
            patientId, 
            file.getName(), 
            fileContent, 
            fileType, 
            description
        );

        out.writeObject(fileData);
        out.flush();

        System.out.println(">>> File sent to Doctor!");
        System.out.println("    File: " + file.getName() + " (" + fileContent.length + " bytes)");
    }
}