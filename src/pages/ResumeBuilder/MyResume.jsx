import { useEffect, useState } from "react";
import { fetchUserCVUrl } from "../../utils/Resume";
export default function MyResume() {
  const [resumeLink, setResumeLink] = useState("");
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const getResumeLink = async () => {
      const link = await fetchUserCVUrl(accessToken);
      console.log(link);
      setResumeLink(link);
    };
    getResumeLink();
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 pb-15">
      <h1 className="text-4xl font-bold mb-6 mt-6">
        CV đã tạo trên Jobcubator
      </h1>
      <div className="flex justify-end w-[70%] gap-2">
        <button className="bg-primary-200 text-white p-2 px-4 rounded-full hover:bg-secondary-2-300 mb-4">
          Chỉnh sửa CV
        </button>
        <button className="bg-red-500 text-white p-2 px-4 rounded-full hover:bg-red-600 mb-4">
          Xóa CV
        </button>
      </div>
      {resumeLink ? (
        <embed
          src={resumeLink}
          className="w-[70%]"
          height="800px"
          type="application/pdf"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
