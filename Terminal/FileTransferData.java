import java.io.Serializable;

public class FileTransferData implements Serializable {
    private static final long serialVersionUID = 1L;

    int patientId;
    String fileName;
    long fileSize;
    byte[] fileContent;
    String fileType; // e.g., "image", "document", "lab_report"
    String description;

    public FileTransferData(int patientId, String fileName, byte[] fileContent, String fileType, String description) {
        this.patientId = patientId;
        this.fileName = fileName;
        this.fileContent = fileContent;
        this.fileSize = fileContent.length;
        this.fileType = fileType;
        this.description = description;
    }

    @Override
    public String toString() {
        return "File: " + fileName + 
               " (" + fileSize + " bytes) " +
               "Type: " + fileType + 
               " | Patient: " + patientId +
               " | Description: " + description;
    }
}
