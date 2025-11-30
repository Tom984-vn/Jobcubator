import { FaFolder } from "react-icons/fa";
import { useState } from "react";
import UploadCV from "../../components/CV/ResumeUpload";
import { IoMdClose } from "react-icons/io";
import { GiQuillInk } from "react-icons/gi";

export default function JobApplicationModal(props) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  return (
    <div
      className={
        props.open
          ? "fixed inset-0  bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
          : "hidden"
      }
    >
      <div className="bg-white rounded-xl w-fit max-w-[50%] raleway-regular flex flex-col ">
        <div className="flex justify-between gap-10 border-b border-gray-300 shadow-md px-10 py-5">
          <p className="text-xl">
            Ứng tuyển{" "}
            <span className="text-primary-400 raleway-bold w-full">
              {props.jobData?.title}
            </span>
          </p>
          <button
            onClick={props.onClose}
            className="bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors duration-200"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="px-10 pb-10 bg-gray-100 pt-5 space-y-2 rounded-xl max-h-[80vh] overflow-auto">
          <p className="flex items-center gap-3 raleway-bold text-lg">
            <FaFolder className="text-xl text-primary-400" /> Chọn CV để ứng
            tuyển
          </p>
          <div>
            <button
              onClick={() => {
                setSelectedMethod("libraryCV");
              }}
              className={
                `w-full mt-5 text-left flex items-center gap-2 pl-5 bg-white mb-5  border text-[#47434d] border-gray-300 py-2 rounded-lg hover:border-primary-400 transition-all duration-150` +
                (selectedMethod === "libraryCV" ? " border-primary-400" : "")
              }
            >
              <div
                className={`rounded-full w-5 h-5 p-1 border ${
                  selectedMethod === "libraryCV"
                    ? "border-primary-400"
                    : "border-gray-400"
                }`}
              >
                <div
                  className={
                    selectedMethod === "libraryCV"
                      ? "bg-primary-400 w-full h-full rounded-full"
                      : ""
                  }
                ></div>
              </div>
              <p
                className={
                  selectedMethod === "libraryCV"
                    ? "text-primary-400 raleway-bold"
                    : ""
                }
              >
                CV được tạo trên Jobcubator
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
          </div>
          <p className="flex items-center gap-3 raleway-bold text-lg mt-10">
            <GiQuillInk className="text-xl text-primary-400" /> Thư giới thiệu
          </p>
          <p className="text-gray-500">
            Hãy viết thư giới thiệu để nhà tuyển dụng hiểu rõ hơn về mong muốn
            nhận việc và năng lực của bạn.
          </p>
          <textarea
            onChange={(e) => setCoverLetter(e.target.value)}
            value={coverLetter}
            placeholder="Viết giới thiệu về bản thân, (điểm mạnh, điểm yếu), và nêu mong muốn, lý do bạn ứng tuyển vào vị trí này..."
            className="w-full h-32 p-3 rounded-lg border border-gray-300 focus:outline-primary-400 resize-none"
          ></textarea>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => props.sendApplication(coverLetter)}
              className="bg-primary-400 w-[80%] text-white px-6 py-2 rounded-lg hover:bg-secondary-2-300 transition-colors duration-200"
            >
              Gửi hồ sơ ứng tuyển
            </button>
            <button className="bg-gray-300 w-[20%] hover:bg-gray-400 px-6 py-2 rounded-lg">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
