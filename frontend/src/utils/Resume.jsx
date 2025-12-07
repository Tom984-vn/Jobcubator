import API from "../api";
import html2pdf from "html2pdf.js";
// Generate PDF from the CVPdf component and upload as user's CV
export async function generateAndUploadAndSaveCV(cvRef, accessToken) {
  if (!cvRef.current) {
    throw new Error("CV ref is not available");
  }

  const opt = {
    margin: 0,
    filename: "resume.pdf",
    html2canvas: {
      scale: 2,
      useCORS: true, // ✅ important for external images
      allowTaint: false,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  try {
    // Generate PDF blob
    const pdfBlob = await html2pdf()
      .set(opt)
      .from(cvRef.current)
      .outputPdf("blob");

    // Upload PDF to backend
    const formData = new FormData();
    formData.append("file", pdfBlob, "resume.pdf");

    const uploadResponse = await API.post("/upload/cv/upload", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Get objectKey from backend response
    const objectKey = uploadResponse.data.objectKey;

    if (!objectKey) {
      throw new Error("No objectKey returned from upload endpoint");
    }

    // Save objectKey in user profile via your /me/cv endpoint
    await API.put("/user/me/cv", objectKey, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "text/plain", // sending raw string
      },
    });

    // Return presigned URL for immediate use
    return uploadResponse.data.cvUrl;
  } catch (err) {
    console.error("Failed to generate, upload, and save CV:", err);
    throw err;
  }
}
export async function fetchUserCVUrl(accessToken) {
  try {
    const response = await API.get("/upload/cv", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // presigned URL
  } catch (error) {
    console.error("Error fetching user CV URL:", error);
    throw error;
  }
}
