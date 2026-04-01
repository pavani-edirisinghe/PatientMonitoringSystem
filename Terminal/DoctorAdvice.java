import java.io.Serializable;

public class DoctorAdvice implements Serializable {
    private static final long serialVersionUID = 1L;

    private String advice;
    private String prescription;

    public DoctorAdvice(String advice, String prescription) {
        this.advice = advice;
        this.prescription = prescription;
    }

    public String getAdvice() {
        return advice;
    }

    public String getPrescription() {
        return prescription;
    }

    @Override
    public String toString() {
        return "Doctor's Advice: " + advice + "\nPrescription: " + prescription;
    }
}
