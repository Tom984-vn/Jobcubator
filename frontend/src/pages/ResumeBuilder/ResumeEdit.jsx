import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RxCaretRight } from "react-icons/rx";
import UploadCV from "../../components/CV/ResumeUpload";
import AICV from "../../components/CV/AICV";

export default function ResumeEdit() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100">
      <div className="w-[85%] mx-auto py-10">
        <div className="flex items-center gap-2 text-md text-gray-500 ">
          <NavLink className={"raleway-bold text-primary-400"} to={"/"}>
            Trang chủ
          </NavLink>
          <RxCaretRight className="text-xl" />
          <NavLink
            className={"raleway-bold text-primary-400"}
            to={"/resume-builder"}
          >
            Mẫu CV
          </NavLink>
          <RxCaretRight className="text-xl" />
          <p>Chỉnh sửa CV</p>
        </div>
        <h1 className="text-2xl raleway-bold my-3">Mẫu CV tiêu chuẩn</h1>
        <div className="grid grid-cols-3 gap-6">
          <img
            src="/images/exampleCV.png"
            alt="Resume Example"
            className="w-full h-auto rounded-md shadow-md col-span-2"
          />
          <div className="bg-white rounded-xl p-5 shadow-md h-fit">
            <h2 className="raleway-bold text-xl mb-4 text-primary-400">
              Bạn muốn tạo CV từ?
            </h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setSelectedMethod("personalInfo");
                }}
                className={
                  `w-full text-left flex items-center gap-2 pl-5 bg-white  border text-[#47434d] border-gray-300 py-2 rounded-lg hover:border-primary-400 transition-all duration-150` +
                  (selectedMethod === "personalInfo"
                    ? " border-primary-400"
                    : "")
                }
              >
                <div
                  className={`rounded-full w-5 h-5 p-1 border ${
                    selectedMethod === "personalInfo"
                      ? "border-primary-400"
                      : "border-gray-400"
                  }`}
                >
                  <div
                    className={
                      selectedMethod === "personalInfo"
                        ? "bg-primary-400 w-full h-full rounded-full"
                        : ""
                    }
                  ></div>
                </div>
                <p
                  className={
                    selectedMethod === "personalInfo"
                      ? "text-primary-400 raleway-bold"
                      : ""
                  }
                >
                  Thông tin hồ sơ cá nhân
                </p>
              </button>
              <button
                onClick={() => {
                  setSelectedMethod("uploadCV");
                }}
                className={
                  `w-full text-left pl-5 bg-white border-gray-300  border text-[#47434d] py-2 rounded-lg hover:border-primary-400 transition-all duration-150` +
                  (selectedMethod === "uploadCV" ? " border-primary-400" : "")
                }
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full w-5 h-5 p-1 border ${
                      selectedMethod === "uploadCV"
                        ? "border-primary-400"
                        : "border-gray-400"
                    }`}
                  >
                    <div
                      className={
                        selectedMethod === "uploadCV"
                          ? "bg-primary-400 w-full h-full rounded-full"
                          : ""
                      }
                    ></div>
                  </div>
                  <p
                    className={
                      selectedMethod === "uploadCV"
                        ? "text-primary-400 raleway-bold"
                        : ""
                    }
                  >
                    Tải lên CV hiện có
                  </p>
                </div>
                {selectedMethod === "uploadCV" && <UploadCV />}
              </button>
              <button
                onClick={() => {
                  setSelectedMethod("aiCV");
                }}
                className={
                  `w-full text-left pl-5 bg-white border-gray-300  border text-[#47434d] py-2 rounded-lg hover:border-primary-400 transition-all duration-150` +
                  (selectedMethod === "aiCV" ? " border-primary-400" : "")
                }
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full w-5 h-5 p-1 border ${
                      selectedMethod === "aiCV"
                        ? "border-primary-400"
                        : "border-gray-400"
                    }`}
                  >
                    <div
                      className={
                        selectedMethod === "aiCV"
                          ? "bg-primary-400 w-full h-full rounded-full"
                          : ""
                      }
                    ></div>
                  </div>
                  <p
                    className={
                      selectedMethod === "aiCV"
                        ? "text-primary-400 raleway-bold"
                        : ""
                    }
                  >
                    Tạo CV với hỗ trợ của AI
                  </p>
                </div>
                {selectedMethod === "aiCV" && <AICV />}
              </button>
              <button
                onClick={() => {
                  setSelectedMethod("blankCV");
                }}
                className={
                  `w-full text-left flex items-center gap-2 pl-5 bg-white  border text-[#47434d] border-gray-300 py-2 rounded-lg hover:border-primary-400 transition-all duration-150` +
                  (selectedMethod === "blankCV" ? " border-primary-400" : "")
                }
              >
                <div
                  className={`rounded-full w-5 h-5 p-1 border ${
                    selectedMethod === "blankCV"
                      ? "border-primary-400"
                      : "border-gray-400"
                  }`}
                >
                  <div
                    className={
                      selectedMethod === "blankCV"
                        ? "bg-primary-400 w-full h-full rounded-full"
                        : ""
                    }
                  ></div>
                </div>
                <p
                  className={
                    selectedMethod === "blankCV"
                      ? "text-primary-400 raleway-bold"
                      : ""
                  }
                >
                  Tạo CV từ đầu
                </p>
              </button>
            </div>
            <button
              onClick={() => {
                navigate(`${selectedMethod}`);
              }}
              className="w-full mt-5 bg-primary-400 text-white py-2 rounded-lg hover:bg-secondary-2-300 transition-all duration-150"
            >
              Tiếp tục
            </button>
            <button className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all duration-150">
              Quay lại danh sách mẫu CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
