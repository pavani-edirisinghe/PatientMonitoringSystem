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

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try (ObjectInputStream in = new ObjectInputStream(socket.getInputStream())) {
            while (true) {
                Vitals data = (Vitals) in.readObject();
                
                System.out.println("------------------------------------------------");
                System.out.println("PATIENT " + data.patientId + " REPORT:");
                System.out.println("   Heart Rate: " + data.heartRate + " bpm");
                System.out.println("   Oxygen:     " + data.oxygenLevel + "%");
                System.out.println("   MESSAGE:    " + data.message);
                System.out.println("------------------------------------------------");

                if (data.heartRate > 100) System.out.println("   *** WARNING: High Heart Rate ***");
                if (data.oxygenLevel < 95) System.out.println("   *** WARNING: Low Oxygen ***");
            }
        } catch (EOFException e) {
            System.out.println("Patient disconnected.");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            try { socket.close(); } catch (IOException e) { e.printStackTrace(); }
        }
    }
}