import ResumeInteractions from "../../components/CV/ResumeInteraction.jsx";
import CVSidebar from "../../components/CV/CVSidebar.jsx";
import CVProfileForm from "../../components/CV/CVProfileForm.jsx";
import { useEffect, useState } from "react";
import CVWorkExperience from "../../components/CV/CVWorkExperience.jsx";
import CVEducation from "../../components/CV/CVEducation.jsx";
import CVSkill from "../../components/CV/CVSkill.jsx";
import CVProjects from "../../components/CV/CVProjects.jsx";
import CVDegree from "../../components/CV/CVDegree.jsx";
import CVAwards from "../../components/CV/CVAwards.jsx";
import CVPdf from "../../components/CV/CVpdf/CVpdf.jsx";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { getUserData } from "../Authentication/Authfunc.jsx";
import { generateAndUploadAndSaveCV } from "../../utils/Resume.jsx";
import { getUserAvatarUrl } from "../../utils/User.jsx";
function mapGenderToVn(gender) {
  if (gender === "MALE") return "Nam";
  if (gender === "FEMALE") return "Nữ";
  return "Khác";
}
export default function ResumeDetail() {
  const [currentSection, setCurrentSection] = useState("profile");
  const [resumeData, setResumeData] = useState({});
  const [avatarUrl, setAvatarUrl] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData(accessToken);
      //Get user data to set profile
      setResumeData({
        ...resumeData,
        profile: {
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          address: userData.preferredLocation || "",
          birthDate: userData.birthDate || "",
          gender: mapGenderToVn(userData.gender) || "",
          phoneNumber: userData.phoneNumber || "",
          jobTitle: userData.position || "",
        },
        education:
          userData.history
            .filter((h) => h.type === "EDUCATION")
            .map((edu) => {
              return {
                schoolName: edu.organization || "",
                degree: edu.description.split("\n")[1] || "",
                major: edu.title || "",
                gpa: edu.description.split("\n")[0] || "",
                startDate: edu.startDate || "",
                endDate: edu.endDate || "",
              };
            }) || [],
        workExperience: {
          jobs:
            userData.history
              .filter((h) => h.type === "EXPERIENCE")
              .map((work) => {
                return {
                  companyName: work.organization || "",
                  position: work.title || "",
                  startDate: work.startDate || "",
                  endDate: work.endDate || "",
                  responsibilities: work.description.split("\n") || "",
                };
              }) || [],
        },
      });
    };
    const fetchAvatar = async () => {
      try {
        const data = await getUserAvatarUrl(accessToken);
        console.log(data);
        setAvatarUrl(data);
      } catch (error) {
        console.error("Error fetching avatar URL:", error);
      }
    };
    fetchAvatar();
    fetchData();
  }, [accessToken]);
  const changeResumeField = (section, field, value) => {
    setResumeData((data) => {
      const currentSection = data?.[section];

      // If field is null -> replace the entire section (works for arrays & objects)
      if (field === null || typeof field === "undefined") {
        return { ...data, [section]: value };
      }

      // If current section is an array
      if (Array.isArray(currentSection)) {
        const updatedArray = [...currentSection];
        updatedArray[field] = value; // field is numeric index
        return { ...data, [section]: updatedArray };
      }

      // Otherwise treat it as an object
      const updatedSection = {
        ...(typeof currentSection === "object" && currentSection !== null
          ? currentSection
          : {}),
        [field]: value,
      };

      return { ...data, [section]: updatedSection };
    });
  };
  const cvRef = useRef();
  const downloadPDF = () => {
    const element = cvRef.current;

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

    html2pdf().from(element).set(opt).save();
  };
  const uploadPDF = async () => {
    try {
      const cvUrl = await generateAndUploadAndSaveCV(cvRef, accessToken);
      alert("CV uploaded and saved successfully!");
      console.log("CV URL:", cvUrl);
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV: " + error.message);
    }
  };
  return (
    <div className="bg-gray-100">
      <ResumeInteractions />
      <div className="flex">
        <CVSidebar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          exportPDF={downloadPDF}
          uploadPDF={uploadPDF}
        />
        {currentSection === "profile" && (
          <CVProfileForm
            resumeData={resumeData.profile}
            changeResumeField={changeResumeField}
          />
        )}
        {currentSection === "workExperience" && (
          <CVWorkExperience
            resumeData={resumeData.workExperience}
            changeResumeField={changeResumeField}
          />
        )}
        {currentSection === "education" && (
          <CVEducation
            resumeData={resumeData}
            changeResumeField={changeResumeField}
          />
        )}
        {currentSection === "skills" && (
          <CVSkill
            resumeData={resumeData.skills}
            changeResumeField={changeResumeField}
          />
        )}
        {currentSection === "projects" && (
          <CVProjects
            resumeData={resumeData.projects}
            changeResumeField={changeResumeField}
          />
        )}
        {currentSection === "certificates" && (
          <CVDegree
            resumeData={resumeData.certificates}
            changeResumeField={changeResumeField}
          />
        )}
        {currentSection === "awards" && (
          <CVAwards
            resumeData={resumeData.awards}
            changeResumeField={changeResumeField}
          />
        )}
        <CVPdf resumeData={resumeData} cvRef={cvRef} avatarUrl={avatarUrl} />
      </div>
    </div>
  );
}
