import "./Auth.css";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { PiReadCvLogoBold } from "react-icons/pi";
import { PiCertificateBold } from "react-icons/pi";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import { loginUser } from "./Authfunc";
import { IoEyeOff } from "react-icons/io5";
export default function SignIn() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const checkValidations = () => {
    let valid = true;
    if (!userData.password || !userData.username) {
      setError("Mật khẩu và tên đăng nhập không được để trống.");
      valid = false;
    }
    return valid;
  };
  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };
  const handleSubmit = async () => {
    if (checkValidations()) {
      try {
        await loginUser({
          username: userData.username,
          password: userData.password,
        });

        navigate("/");
      } catch (err) {
        setError("Tên tài khoản hoặc mật khẩu không đúng.");
      }
    }
  };
  return (
    <div className="AuthContainer grid grid-cols-2 h-[100vh]">
      <div className="authForm flex flex-col justify-center items-center text-left">
        <div className="flex items-center absolute top-5 left-10">
          <LuBriefcaseBusiness size={40} color="#1C229E" />
          <span className="logoText text-[#1C229E] font-bold text-2xl">
            Jobcubator
          </span>
        </div>
        <div className="text-[#1C229E] flex flex-col w-[60%]">
          <h1 className="font-bold text-3xl mb-2">Đăng nhập</h1>
          <p className="text-gray-500 mb-6">
            Bạn không có tài khoản?{" "}
            <span
              className="text-[#1C229E] font-medium hover:font-bold hover:underline hover:text-[#E48309]"
              onClick={() => navigate("/signUp")}
            >
              Đăng ký
            </span>
          </p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Tên tài khoản của bạn"
            className={`border-1 rounded-lg p-2 mb-6 focus:outline-[#E48309] ${
              error ? "border-red-500 border-2" : ""
            }`}
            onChange={(e) => {
              handleInputChange("username", e.target.value);
            }}
          />
          <div className="flex flex-col relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Mật khẩu"
              className={`border-1 rounded-lg p-2 mb-4 focus:outline-[#E48309] ${
                error ? "border-red-500 border-2" : ""
              }`}
              onChange={(e) => {
                handleInputChange("password", e.target.value);
              }}
            />
            {showPass ? (
              <IoEyeOff
                className="absolute right-4 top-[15%] hover:text-blue-500"
                size={20}
                onClick={() => {
                  setShowPass(false);
                }}
              />
            ) : (
              <FaEye
                className="absolute right-4 top-[15%] hover:text-blue-500"
                size={20}
                onClick={() => {
                  setShowPass(true);
                }}
              />
            )}
          </div>
          <div className="flex justify-between">
            <label className="checkbox flex items-center cursor-pointer select-none">
              <input type="checkbox" />
              <span className="text-gray-500 ml-1 hover:underline">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <p className="hover:text-[#E48309] hover:font-bold">
              Quên mật khẩu?
            </p>
          </div>
          <button
            onClick={() => {
              handleSubmit();
            }}
            className="bg-[#464CBC] text-white hover:bg-[#1C229E] rounded-lg p-2 mt-6 mb-4"
          >
            Đăng Nhập
          </button>
          <p className="text-center text-gray-500 border-b-1 pb-2">Hoặc</p>
          <div className="flex mt-4 justify-around">
            <div className="border-2 border-[#464CBC] p-2 rounded-lg text-sm flex items-center cursor-pointer hover:bg-[#1C229E] hover:text-white">
              <FaGoogle className="inline mr-2" />
              Đăng nhập bằng Google
            </div>
            <div className="border-2 border-[#464CBC] p-2 rounded-lg text-sm flex items-center hover:bg-[#1C229E] hover:text-white cursor-pointer">
              <FaFacebook className="inline mr-2" />
              Đăng nhập bằng Facebook
            </div>
          </div>
        </div>
      </div>
      <div className="authBanner h-full relative">
        <div className="overlay"></div>
        <div className="flex justify-center text-white flex-col absolute bottom-30 left-20">
          <h1 className="z-20 font-bold w-[80%] text-left items-end text-3xl">
            Nền tảng tìm việc làm cho mọi đối tượng.
          </h1>
          <p className="z-20 text-gray-200 font-medium">
            Đã có <span className="text-[#E48309] font-bold">123</span> người
            tìm được việc làm trong hôm nay. Còn bạn?
          </p>
          <div className="flex">
            <div className="flex flex-col items-center mr-10">
              <div className="bg-white opacity-30 p-2 rounded-lg mt-10 z-20">
                <LuBriefcaseBusiness size={30} color="black" />
              </div>
              <p className="z-20 text-gray-200 font-medium">
                Không cần kinh nghiệm
              </p>
            </div>
            <div className="flex flex-col items-center mr-10">
              <div className="bg-white opacity-30 p-2 rounded-lg mt-10 z-20">
                <PiCertificateBold size={30} color="black" />
              </div>
              <p className="z-20 text-gray-200 font-medium">
                Không cần bằng cấp
              </p>
            </div>
            <div className="flex flex-col items-center mr-10">
              <div className="bg-white opacity-30 p-2 rounded-lg mt-10 z-20">
                <PiReadCvLogoBold size={30} color="black" />
              </div>
              <p className="z-20 text-gray-200 font-medium">
                Không cần có CV trước
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
