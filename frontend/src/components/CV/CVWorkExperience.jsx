import CVRadioInput from "./CVRadioInput";
import CVTextArea from "./CVTextArea";
import CVTextInput from "./CVTextinput";
import { useState } from "react";
function JobResponsibilities({ responsibilities, setResponsibilities }) {
  const handleChange = (index, value) => {
    const newList = [...responsibilities];
    newList[index] = value;
    setResponsibilities(newList);
  };

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, ""]);
  };

  const removeResponsibility = () => {
    if (responsibilities.length > 1) {
      setResponsibilities(responsibilities.slice(0, -1));
    }
  };

  return (
    <div className="mt-5">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Trách nhiệm công việc của bạn
      </label>

      {responsibilities.map((resp, index) => (
        <div key={index} className="flex gap-3 mb-2 items-start">
          <input
            type="text"
            placeholder="Nhập trách nhiệm công việc"
            value={resp}
            onChange={(e) => handleChange(index, e.target.value)}
            className="shadow appearance-none border rounded w-[75%] py-2 px-3 text-gray-700"
          />

          {index === responsibilities.length - 1 && (
            <div className="flex gap-2">
              <button
                className="mt-2 text-lg text-primary-400 border border-primary-400 w-8 h-8 rounded-full hover:bg-primary-400 hover:text-white flex items-start justify-center"
                onClick={addResponsibility}
              >
                +
              </button>

              <button
                className={`mt-2 text-lg text-primary-400 border border-primary-400 w-8 h-8 rounded-full  flex items-start justify-center ${
                  responsibilities.length === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary-400 hover:text-white"
                }`}
                disabled={responsibilities.length === 1}
                onClick={removeResponsibility}
              >
                -
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CompanyForm({ data, index, updateItem }) {
  const setField = (field, value) => {
    updateItem(index, { ...data, [field]: value });
  };

  const setResponsibilities = (responsibilities) => {
    updateItem(index, { ...data, responsibilities });
  };

  return (
    <div className="border-t-10 border-primary-400 pt-5 ">
      <CVTextInput
        label="Tên công ty"
        value={data.companyName || ""}
        onChange={(e) => setField("companyName", e.target.value)}
      />

      <CVTextInput
        label="Vị trí làm việc"
        value={data.position || ""}
        onChange={(e) => setField("position", e.target.value)}
      />

      <CVTextInput
        label="Địa điểm công ty"
        value={data.location || ""}
        onChange={(e) => setField("location", e.target.value)}
      />

      <CVTextInput
        label="Ngày bắt đầu"
        value={data.startDate || ""}
        onChange={(e) => setField("startDate", e.target.value)}
      />

      <CVTextInput
        label="Ngày kết thúc"
        value={data.endDate || ""}
        onChange={(e) => setField("endDate", e.target.value)}
      />

      <JobResponsibilities
        responsibilities={data.responsibilities || [""]}
        setResponsibilities={setResponsibilities}
      />
    </div>
  );
}
export default function CVWorkExperience({ resumeData, changeResumeField }) {
  const jobs = resumeData?.jobs || [];

  const updateJob = (index, newJob) => {
    const updated = [...jobs];
    updated[index] = newJob;
    changeResumeField("workExperience", null, { ...resumeData, jobs: updated });
  };

  const addJob = () => {
    const newJob = {
      companyName: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      responsibilities: [""],
    };

    const updated = [...jobs, newJob];
    changeResumeField("workExperience", null, { ...resumeData, jobs: updated });
  };

  const removeJob = () => {
    if (jobs.length === 0) return;
    const updated = jobs.slice(0, -1);
    changeResumeField("workExperience", null, { ...resumeData, jobs: updated });
  };

  return (
    <div className="bg-white p-5 w-[30%] max-h-screen overflow-y-auto sticky top-15">
      <h1 className="raleway-bold text-lg mb-5">
        Kinh nghiệm làm việc của bạn
      </h1>

      <CVTextArea
        label="Mục tiêu nghề nghiệp"
        value={resumeData?.careerObjective || ""}
        onChange={(e) =>
          changeResumeField("workExperience", "careerObjective", e.target.value)
        }
      />

      {jobs.map((job, index) => (
        <CompanyForm
          key={index}
          data={job}
          index={index}
          updateItem={updateJob}
        />
      ))}

      <div className="mt-5 flex gap-3">
        <button
          onClick={addJob}
          className="border-primary-400 border rounded text-primary-400 hover:bg-primary-400 hover:text-white px-2 p-1"
        >
          Thêm việc
        </button>

        <button
          onClick={removeJob}
          className="border-red-500 border rounded text-red-500 hover:bg-red-500 hover:text-white px-2 p-1"
        >
          Xóa việc
        </button>
      </div>
    </div>
  );
}
