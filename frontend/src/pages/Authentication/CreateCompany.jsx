import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../../utils/Company";
export default function CreateCompany() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [companyData, setCompanyData] = useState({
    name: "",
    sizeFrom: "",
    sizeTo: "",
    website: "",
    description: "",
  });
  console.log(accessToken);
  const handleInputChange = (field, value) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!companyData.name.trim()) {
      newErrors.name = "Tên công ty là bắt buộc.";
    }
    if (!companyData.website.trim()) {
      newErrors.website = "Website công ty là bắt buộc.";
    }
    if (
      !companyData.sizeFrom ||
      !companyData.sizeTo ||
      Number(companyData.sizeFrom) <= 0 ||
      Number(companyData.sizeTo) <= 0 ||
      Number(companyData.sizeFrom) > Number(companyData.sizeTo)
    ) {
      newErrors.size =
        "Kích thước công ty không hợp lệ. Vui lòng kiểm tra lại.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await createCompany(
      {
        name: companyData.name,
        website: companyData.website,
        size: `${companyData.sizeFrom}-${companyData.sizeTo}`,
        description: companyData.description,
      },
      accessToken
    );
    navigate("/employer");
  };
  return (
    <div className="text-[#1C229E] flex flex-col w-[65%]">
      <h1 className="font-bold text-3xl mb-2">Tạo công ty</h1>
      <p className="text-gray-500 mb-4">
        Bạn đã thuộc một công ty trên Jobcubator?{" "}
        <span
          className="text-[#1C229E] font-medium hover:font-bold hover:underline hover:text-[#E48309]"
          onClick={() => navigate("/login")}
        >
          Xác nhận
        </span>
      </p>
      <div>
        {/* Display the first validation error */}
        {Object.values(errors).find((error) => error !== "") && (
          <p className="text-red-500 mb-2">
            {Object.values(errors).find((error) => error !== "")}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 w-full gap-5">
        <div className="flex flex-col">
          <p className="text-primary-400 raleway-bold mb-3">
            Nhập tên công ty của bạn
          </p>
          <input
            type="text"
            placeholder="Tên công ty"
            className={`border rounded p-2 mb-4 w-full focus:outline-[#E48309] ${
              errors.name ? "border-red-500 border-2" : ""
            }`}
            value={companyData.name}
            onChange={(e) => {
              handleInputChange("name", e.target.value);
            }}
          />
        </div>
        <div>
          <p className="text-primary-400 raleway-bold mb-3">
            Tên website công ty của bạn
          </p>
          <input
            type="text"
            placeholder="Website công ty"
            className={`border rounded p-2 mb-4 w-full focus:outline-[#E48309] ${
              errors.website ? "border-red-500 border-2" : ""
            }`}
            value={companyData.website}
            onChange={(e) => {
              handleInputChange("website", e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-primary-400 raleway-bold mb-3">
          Nhập kích thước công ty của bạn
        </p>
        <div className="grid grid-cols-2 w-full gap-5">
          <input
            type="number"
            placeholder="Từ khoảng"
            className={`border rounded p-2 mb-4 focus:outline-[#E48309] ${
              errors.size ? "border-red-500 border-2" : ""
            }`}
            value={companyData.sizeFrom}
            onChange={(e) => {
              handleInputChange("sizeFrom", e.target.value);
            }}
          />
          <input
            type="number"
            placeholder="Đến khoảng"
            className={`border rounded p-2 mb-4 focus:outline-[#E48309] ${
              errors.size ? "border-red-500 border-2" : ""
            }`}
            value={companyData.sizeTo}
            onChange={(e) => {
              handleInputChange("sizeTo", e.target.value);
            }}
          />
        </div>
      </div>

      <p className="text-primary-400 raleway-bold mb-3">
        Nhập mô tả công ty của bạn
      </p>
      <textarea
        placeholder="Mô tả công ty của bạn (sứ mệnh, tầm nhìn, văn hóa,... )"
        className={`border rounded p-2 mb-4 focus:outline-[#E48309] ${
          errors.description ? "border-red-500 border-2" : ""
        }`}
        value={companyData.description}
        onChange={(e) => {
          handleInputChange("description", e.target.value);
        }}
        rows={3}
      />
      <label className="flex">
        <input type="checkbox" />
        <p className="text-gray-500 ml-2 hover:underline">
          Tôi đã đọc và đồng ý với{" "}
          <span className="text-[#1C229E] font-medium hover:font-bold hover:underline hover:text-[#E48309]">
            Điều Khoản và Điều kiện
          </span>
        </p>
      </label>
      <button
        onClick={(e) => {
          handleSubmit(e);
        }}
        className="bg-[#464CBC] text-white hover:bg-[#1C229E] rounded-lg p-2 mt-6 mb-4"
      >
        Đăng Ký
      </button>
    </div>
  );
}
