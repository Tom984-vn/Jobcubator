import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { RxCaretDown } from "react-icons/rx";
import { IoLocationOutline } from "react-icons/io5";
import { PiCaretDown } from "react-icons/pi";
import { BiSearchAlt2 } from "react-icons/bi";
import { RxCaretRight } from "react-icons/rx";
const testJobGroups = [
  "Công nghệ thông tin",
  "Tiếp thị",
  "Bán hàng",
  "Thiết kế",
  "Hành chính - Văn phòng",
  "Dịch vụ khách hàng",
  "Kỹ thuật",
  "Sản xuất",
  "Tài chính - Kế toán",
  "Nhân sự",
];
const JobsDropdown = (props) => {
  return (
    <div className="absolute top-[100%] left-0 bg-white shadow-lg rounded-md mt-2 p-4 pb-0 w-full z-10 w-200 max-h-120">
      <button
        onClick={() => {
          props.cancel();
        }}
        className="absolute text-sm right-2 top-2 rounded-full bg-gray-300 p-1 px-3 aspect-square hover:bg-gray-400"
      >
        X
      </button>
      <h2 className="raleway-bold">Chọn nhóm nghề, nghề hoặc chuyên môn</h2>
      <div className="relative my-3">
        <input
          className="w-full rounded-full p-2 px-10 border border-gray-300 focus:outline-0 focus:border-secondary-2-300 focus:border-2"
          placeholder="Nhập từ khóa cần tìm kiếm"
        />
        <BiSearchAlt2 className="absolute top-3 left-4 text-gray-400" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className=" border-r border-gray-300 col-span-1 overflow-y-scroll max-h-70">
          <h2 className="text-gray-500">Nhóm ngành</h2>
          {testJobGroups.map((group) => (
            <p
              key={group}
              className="my-2 hover:text-secondary-2-300 cursor-pointer flex justify-between items-center"
            >
              <div className="flex gap-2">
                <input type="checkbox" />
                {group}
              </div>
              <RxCaretRight className="inline-block ml-2 text-xl" />
            </p>
          ))}
        </div>
        <div className="col-span-1 border-r border-gray-300">
          <h2 className="text-gray-500">Nghề</h2>
        </div>
        <div className="col-span-2">
          <h2 className="text-gray-500">Vị trí việc làm</h2>
        </div>
      </div>
      <div className="flex justify-end mt-4 border-t border-gray-300 py-3">
        <button
          onClick={() => {
            props.cancel();
          }}
          className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full mr-4 hover:bg-gray-300"
        >
          Hủy
        </button>
        <button className="bg-secondary-2-300 text-white  py-2 rounded-full px-10 hover:bg-secondary-2-400">
          Chọn
        </button>
      </div>
    </div>
  );
};
const LocationDropDown = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [currentCity, setCurrentCity] = useState();
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://provinces.open-api.vn/api/v1/?depth=2"
        );
        const data = await response.json();
        setCitiesData(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCities();
  }, []);

  // Handle city click
  const handleCityClick = (city) => {
    setCurrentCity(city);
    // Toggle city selection
    setSelectedCities((prev) => {
      if (prev.includes(city.name)) return prev.filter((c) => c !== city.name);
      return [...prev, city.name];
    });
  };

  // Handle "Select All" districts for current city
  const handleSelectAllDistricts = (e) => {
    setSelectedDistricts((districts) => {
      const allDistrictNames = currentCity.districts.map((d) => d.name);
      if (e.target.checked) {
        return [...new Set([...districts, ...allDistrictNames])];
      } else {
        return districts.filter((d) => !allDistrictNames.includes(d));
      }
    });
  };

  // Handle single district
  const handleSingleDistrict = (districtName, checked) => {
    setSelectedDistricts((districts) => {
      if (checked) return [...districts, districtName];
      return districts.filter((d) => d !== districtName);
    });
  };

  // Check if all districts are selected for current city
  const isAllDistrictSelected =
    currentCity &&
    currentCity.districts.every((d) => selectedDistricts.includes(d.name));

  // Filtered cities based on search
  const filteredCities = citiesData.filter((city) =>
    city.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="absolute top-[100%] right-0 bg-white shadow-xl rounded-md mt-2 p-1 pb-0 z-10 w-140 max-h-140 grid grid-cols-2 gap-2">
      {/* LEFT COLUMN — Cities */}
      <div className="relative my-3">
        <input
          className="w-full rounded-full p-2 px-10 border border-gray-300 focus:outline-0 focus:border-secondary-2-300 focus:border-2"
          placeholder="Nhập tỉnh/thành phố"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <BiSearchAlt2 className="absolute top-3 left-4 text-gray-400" />
        <div className="max-h-80 overflow-auto p-2">
          {filteredCities.map((city) => (
            <p
              key={city.name}
              className="my-2 hover:text-secondary-2-300 cursor-pointer flex justify-between items-center"
              onClick={() => setCurrentCity(city)}
            >
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city.name)}
                  onChange={() => handleCityClick(city)}
                />
                {city.name}
              </div>
              <RxCaretRight className="inline-block ml-2 text-xl" />
            </p>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN — Districts */}
      <div className="border-l-1 border-gray-300">
        <h2 className="raleway-bold mt-5 mb-3 text-gray-500 px-2 w-full border-b-1 pb-3 border-gray-300">
          QUẬN/HUYỆN
        </h2>

        {currentCity ? (
          <div className="px-3 max-h-80 overflow-auto">
            {/* SELECT ALL DISTRICTS */}
            <p className="hover:text-secondary-2-300 cursor-pointer flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={isAllDistrictSelected}
                  onChange={handleSelectAllDistricts}
                />
                Tất cả
              </div>
            </p>

            {/* INDIVIDUAL DISTRICTS */}
            {currentCity.districts.map((district) => {
              const isChecked = selectedDistricts.includes(district.name);
              return (
                <p
                  key={district.name}
                  className="my-2 hover:text-secondary-2-300 cursor-pointer flex gap-2 items-center"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleSingleDistrict(district.name, e.target.checked)
                    }
                  />
                  {district.name}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Hãy chọn một tỉnh, thành phố
          </p>
        )}
      </div>
    </div>
  );
};
export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  return (
    <div className="bg-primary-300 py-5 ">
      <div className="flex justify-center bg-white w-fit rounded-xl space-x-3 mx-auto h-12 relative">
        {open && (
          <JobsDropdown
            cancel={() => {
              setOpen(false);
            }}
          />
        )}
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="flex items-center gap-3 bg-gray-200 raleway-bold px-4 h-full rounded-l-2xl"
        >
          <FaList />
          Danh mục nghề
          <RxCaretDown
            size={25}
            className={`${open && "-scale-y-100"} transition duration-300`}
          />
        </button>
        <div className="flex items-center">
          <IoSearch className="text-gray-500" />
          <input
            placeholder="Vị trí tuyển dụng"
            className="w-100 focus:outline-0 border-r-2 border-gray-300 p-2"
          />
        </div>
        <div className="flex items-center">
          <div
            className="flex items-center"
            onClick={() => setLocationOpen(!locationOpen)}
          >
            <IoLocationOutline className="text-gray-500" />
            <p className="border-gray-300 p-2 w-50">Địa điểm</p>
            <PiCaretDown className="text-gray-500" />
          </div>
          {locationOpen && <LocationDropDown />}
        </div>
        <button className="bg-secondary-2-300 px-3 text-white flex items-center gap-1 rounded-r-xl">
          <IoSearch />
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
