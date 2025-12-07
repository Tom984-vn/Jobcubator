const testJobPositions = [
  "Kỹ sư phần mềm",
  "Nhà phân tích dữ liệu",
  "Quản lý dự án",
  "Chuyên viên tiếp thị kỹ thuật số",
  "Nhà thiết kế UX/UI",
  "Chuyên viên bán hàng",
  "Chuyên viên nhân sự",
  "Kỹ sư mạng",
  "Chuyên viên hỗ trợ kỹ thuật",
  "Nhà phát triển web",
];
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa6";

export default function AICV() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <p className="mt-2 raleway-bold">Chọn vị trí</p>
      <div className="relative mr-4 mt-2 group">
        <p
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex justify-between items-center border border-gray-300 px-4 py-2 rounded-lg "
          onBlur={() => setOpenDropdown(false)}
        >
          {selectedPosition ? selectedPosition : "Chưa chọn vị trí"}{" "}
          <FaCaretDown />
        </p>
        {openDropdown && (
          <div className="border absolute bg-white w-full border-gray-300 rounded-lg max-h-80  mr-4 mt-2">
            <div className="flex ">
              <input
                type="text"
                placeholder="Tìm kiếm vị trí"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-secondary-2-300 w-[95%] mx-auto px-2 mt-3 mb-1 py-2 rounded-lg focus:outline-0"
              />
            </div>
            <div className="overflow-y-scroll max-h-60">
              {testJobPositions
                .filter((position) =>
                  position.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((position, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setSelectedPosition(position);
                      setOpenDropdown(false);
                    }}
                    className="px-2 py-1 hover:bg-gray-300"
                  >
                    {position}
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
