import { useState } from "react";
export default function EmployerAddJob() {
  const [selectedSalaryType, setSelectedSalaryType] = useState("range");
  const [selectedWorkLocation, setSelectedWorkLocation] = useState("on-site");
  const [workDescription, setWorkDescription] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [jobData, setJobData] = useState({
    title: "",
    category: "",
    companyAddress: "",
    numberOfVacancies: "",
    jobType: "",
    applicationDeadline: "",
    minSalary: "",
    maxSalary: "",
    description: "",
    requirements: "",
    benefits: "",
    schedule: "",
    tags: new Set(),
  });
  const changeDataField = (field, value) => {
    setJobData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  return (
    <div className="m-5 p-5 bg-white rounded-lg w-full">
      <h1 className="text-2xl raleway-bold mb-4">Thêm việc làm mới</h1>
      <form className="space-y-4">
        <div className="space-y-4">
          <label className="block text-gray-700">Tiêu đề công việc</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
            placeholder="Nhập tiêu đề công việc"
            value={jobData.title || ""}
            onChange={(e) => changeDataField("title", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <label className="block text-gray-700">Mức lương</label>
              <input
                type="radio"
                name="salaryType"
                value="fixed"
                checked={selectedSalaryType === "fixed"}
                onChange={() => {
                  setSelectedSalaryType("fixed");
                }}
              />
              {"  "}
              Lương cố định
              <input
                type="radio"
                name="salaryType"
                value="negotiable"
                className="ml-4"
                checked={selectedSalaryType === "negotiable"}
                onChange={() => {
                  setSelectedSalaryType("negotiable");
                  changeDataField("salaryType", "negotiable");
                }}
              />
              {"  "}
              Lương thỏa thuận
              <input
                type="radio"
                name="salaryType"
                value="range"
                className="ml-4"
                checked={selectedSalaryType === "range"}
                onChange={() => {
                  setSelectedSalaryType("range");
                }}
              />
              {"  "}
              Khoảng lương
            </div>
            {selectedSalaryType === "range" && (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
                  placeholder="Mức lương tối thiểu"
                  value={jobData.minSalary || ""}
                  onChange={(e) => changeDataField("minSalary", e.target.value)}
                />
                <p>-</p>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
                  placeholder="Mức lương tối đa"
                  value={jobData.maxSalary || ""}
                  onChange={(e) => changeDataField("maxSalary", e.target.value)}
                />
              </div>
            )}
            {selectedSalaryType === "fixed" && (
              <div className="space-y-4">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
                  placeholder="Nhập mức lương"
                  value={jobData.fixedSalary || ""}
                  onChange={(e) => {
                    changeDataField("minSalary", e.target.value);
                    changeDataField("maxSalary", e.target.value);
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <div className="space-y-4">
              <label className="block text-gray-700">Địa điểm làm việc</label>
              <input
                type="radio"
                name="workLocation"
                value="remote"
                checked={selectedWorkLocation === "remote"}
                onChange={() => {
                  setSelectedWorkLocation("remote");
                  changeDataField("companyAddress", "remote");
                }}
              />
              {"  "}
              Làm việc từ xa
              <input
                type="radio"
                name="workLocation"
                value="on-site"
                className="ml-4"
                checked={selectedWorkLocation === "on-site"}
                onChange={() => {
                  setSelectedWorkLocation("on-site");
                }}
              />
              {"  "} Làm tại công ty
            </div>
            {selectedWorkLocation === "on-site" && (
              <div className="space-y-4">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
                  placeholder="Nhập địa chỉ công việc"
                  value={jobData.companyAddress || ""}
                  onChange={(e) =>
                    changeDataField("companyAddress", e.target.value)
                  }
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Kinh nghiệm</label>
            <input
              type="text"
              className="border border-gray-300 mt-4 rounded-lg p-2 w-full focus:outline-primary-400"
              placeholder="Nhập kinh nghiệm yêu cầu"
            />
          </div>
          <div>
            <label className="block text-gray-700">Hạn nộp hồ sơ</label>
            <input
              type="date"
              className="border border-gray-300 mt-4 rounded-lg p-2 w-full focus:outline-primary-400"
            />
          </div>
          <div>
            <label className="block text-gray-700">Trình độ học vấn</label>
            <select className="border border-gray-300 mt-4 rounded-lg p-2 w-full focus:outline-primary-400">
              <option value="">Chọn trình độ</option>
              <option value="high-school">Trung học phổ thông</option>
              <option value="bachelor">Cử nhân</option>
              <option value="master">Thạc sĩ</option>
              <option value="doctorate">Tiến sĩ</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Cấp bậc tuyển dụng</label>
            <input
              type="text"
              className="border border-gray-300 mt-4 rounded-lg p-2 w-full focus:outline-primary-400"
              placeholder="Nhập cấp bậc"
            />
          </div>
          <div>
            <label className="block text-gray-700">Số lượng cần tuyển</label>
            <input
              type="number"
              className="border border-gray-300 mt-4 rounded-lg p-2 w-full focus:outline-primary-400"
              placeholder="Nhập số lượng"
            />
          </div>
          <div>
            <label className="block text-gray-700">Loại hình công việc</label>
            <select className="border border-gray-300 mt-4 rounded-lg p-2 w-full focus:outline-primary-400">
              <option value="">Chọn loại hình</option>
              <option value="full-time">Toàn thời gian</option>
              <option value="part-time">Bán thời gian</option>
              <option value="internship">Thực tập</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Mô tả công việc</label>
          {workDescription.map((desc, index) => (
            <input
              key={index}
              type="text"
              value={desc}
              onChange={(e) => {
                const newDescriptions = [...workDescription];
                newDescriptions[index] = e.target.value;
                setWorkDescription(newDescriptions);
              }}
              className="border border-gray-300 rounded-lg p-2 w-full mt-2 focus:outline-primary-400"
              placeholder={`Mô tả công việc ${index + 1}`}
            />
          ))}
          <button
            type="button"
            className="mt-2 bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-secondary-2-300 transition-colors duration-300"
            onClick={() => setWorkDescription([...workDescription, ""])}
          >
            Thêm mô tả
          </button>
          <button
            type="button"
            className="mt-2 ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors duration-300"
            onClick={() => {
              const newDescriptions = [...workDescription];
              newDescriptions.pop();
              setWorkDescription(newDescriptions);
            }}
          >
            Xóa mô tả
          </button>
        </div>
        <div>
          <label className="block text-gray-700">Yêu cầu công việc</label>
          {requirements.map((req, index) => (
            <input
              key={index}
              type="text"
              value={req}
              onChange={(e) => {
                const newRequirements = [...requirements];
                newRequirements[index] = e.target.value;
                setRequirements(newRequirements);
              }}
              className="border border-gray-300 rounded-lg p-2 w-full mt-2 focus:outline-primary-400"
              placeholder={`Yêu cầu công việc ${index + 1}`}
            />
          ))}
          <button
            type="button"
            className="mt-2 bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-secondary-2-300 transition-colors duration-300"
            onClick={() => setRequirements([...requirements, ""])}
          >
            Thêm yêu cầu
          </button>
          <button
            type="button"
            className="mt-2 ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors duration-300"
            onClick={() => {
              const newRequirements = [...requirements];
              newRequirements.pop();
              setRequirements(newRequirements);
            }}
          >
            Xóa yêu cầu
          </button>
        </div>
        <div>
          <label className="block text-gray-700">Quyền lợi</label>
          {benefits.map((benefit, index) => (
            <input
              key={index}
              type="text"
              value={benefit}
              onChange={(e) => {
                const newBenefits = [...benefits];
                newBenefits[index] = e.target.value;
                setBenefits(newBenefits);
              }}
              className="border border-gray-300 rounded-lg p-2 w-full mt-2 focus:outline-primary-400"
              placeholder={`Quyền lợi ${index + 1}`}
            />
          ))}
          <button
            type="button"
            className="mt-2 bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-secondary-2-300 transition-colors duration-300"
            onClick={() => setBenefits([...benefits, ""])}
          >
            Thêm quyền lợi
          </button>
          <button
            type="button"
            className="mt-2 ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors duration-300"
            onClick={() => {
              const newBenefits = [...benefits];
              newBenefits.pop();
              setBenefits(newBenefits);
            }}
          >
            Xóa quyền lợi
          </button>
        </div>
        <div className="flex justify-end">
          <button className="bg-primary-400 text-white px-6 py-3 rounded-lg hover:bg-secondary-2-300 transition-colors duration-300">
            Thêm việc làm
          </button>
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors duration-300 ml-4">
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
