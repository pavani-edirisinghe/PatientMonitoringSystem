import java.io.Serializable;

public class Vitals implements Serializable {
    private static final long serialVersionUID = 1L;

    int patientId;
    double temperature;
    int heartRate;
    int oxygenLevel;
    String message; // <--- NEW: The chat message

    public Vitals(int id, double temp, int hr, int spo2, String msg) {
        this.patientId = id;
        this.temperature = temp;
        this.heartRate = hr;
        this.oxygenLevel = spo2;
        this.message = msg;
    }

    @Override
    public String toString() {
        return "ID: " + patientId + 
               " | HR: " + heartRate + 
               " | SpO2: " + oxygenLevel + "%" +
               " | NOTE: " + message; // <--- Display the message
    }
}