import { useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useState } from "react";
export default function UploadCV() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // bắt sự kiện để cho phép drop
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer rounded-lg hover:border-blue-500 mr-4 mt-4"
    >
      {fileName ? (
        <p>{fileName}</p>
      ) : (
        <>
          <FaCloudUploadAlt className="mx-auto mb-2 text-gray-400" size={40} />
          <p className="raleway-bold">
            Tải lên CV từ máy tính hoặc kéo thả vào đây
          </p>
        </>
      )}
      <button
        type="button"
        onClick={handleClick}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Chọn file
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
