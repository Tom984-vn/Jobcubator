import "./Profile.css";
import EditIcon from "./EditIcon.jsx";
import NavBar from "../../components/NavBar/NavBar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoTrash } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
function mapGenderToVn(gender) {
  if (gender === "MALE") return "Nam";
  if (gender === "FEMALE") return "Nữ";
  return "Khác";
}

const VarietyBox = (props) => {
  return (
    <div
      className="
      flex
      w-fit
      h-fit
      cursor-pointer
      rounded
      bg-cyan-100
      px-0.5
      gap-0.5
      "
    >
      {props.skillIcon}
      <p className="text-sm">{props.displayText}</p>
    </div>
  );
};

const AcademicsBox = (props) => {
  return (
    <div
      className="
      flex
      flex-1
      place-content-between
      h-fit
      rounded
      p-2
      gap-2
      "
    >
      <p className="flex-1">{props.timeString}</p>
      <div className="flex flex-col flex-3">
        <p className="">{props.displayText}</p>
        {props.field && <p className="text-sm">Chuyên ngành: {props.field}</p>}
      </div>
      <EditIcon displayText="Chỉnh sửa" />
      <EditIcon
        className="text-red-400! border-red-400! hover:bg-red-500! hover:text-white! hover:border-red-500!"
        displayText="Xóa"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 self-center"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
    </div>
  );
};
import { getUserData } from "../Authentication/Authfunc.jsx";
import { UpdateUserProfile } from "../../utils/User.jsx";
import CVRadioInput from "../../components/CV/CVRadioInput.jsx";
import AvatarUploader from "./AvatarUploader.jsx";
export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserData(accessToken);
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);
  const postUpdate = async () => {
    try {
      const data = await UpdateUserProfile(userProfile, accessToken);
      alert("Update thông tin thành công!");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };
  return (
    <div className="relative bg-gray-100 gap-3 items-center ">
      <NavBar />
      <div
        className="
        flex
        flex-row
        place-content-between
        w-[85%]
        gap-4
        mx-auto
        py-10
        "
      >
        <div
          className="
          relative
          flex
          flex-col
          h-fit
          flex-2
          gap-3
          "
        >
          <div
            className="
            fields-container
            flex-1
            grid
            grid-cols-2
            rounded
            border-stone-400
            gap-3
            justify-around
            w-full
            "
          >
            <div
              className="
              one-field
              "
            >
              <div className="top-part ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 self-center"
                >
                  <path
                    fillRule="evenodd"
                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p
                  className="
                  left-0
                  text-sm
                  flex-1
                  self-center
                  "
                >
                  Địa điểm
                </p>
              </div>
              <input
                className="
                info-text-box
                left-0
                flex-1
                "
                placeholder="Nhập địa điểm bạn muốn làm việc"
                value={userProfile.preferredLocation || ""}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    preferredLocation: e.target.value,
                  })
                }
              ></input>
            </div>
            <div
              className="
              one-field
              "
            >
              <div className="top-part ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 self-center"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p
                  className="
                  left-0
                  text-sm
                  flex-1
                  self-center
                  "
                >
                  Loại thời gian
                </p>
              </div>
              <div
                className="
                flex
                flex-wrap
                flex-1
                border
                border-slate-200
                transition-all
                ease-in-out
                duration-200
                hover:border-slate-300
                hover:shadow
                rounded
                p-2
                gap-2
                overflow-scroll
                "
              >
                <VarietyBox displayText="Toàn thời gian" />
                <VarietyBox
                  skillIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4 self-center"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  displayText="Ca đêm"
                />
              </div>
            </div>
            <div
              className="
              one-field
              "
            >
              <div className="top-part ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 self-center"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
                <p
                  className="
                  top-0
                  left-0
                  text-sm
                  flex-1
                  self-center
                  "
                >
                  Email
                </p>
              </div>
              <input
                className="
                info-text-box
                "
                placeholder="Nhập mail của bạn"
                value={userProfile.email || ""}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, email: e.target.value })
                }
              ></input>
            </div>
            <div
              className="
              one-field
              "
            >
              <div className="top-part ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 self-center"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p
                  className="
                  left-0
                  text-sm
                  flex-1
                  self-center
                  "
                >
                  Số di động
                </p>
              </div>
              <input
                className="
                info-text-box
                left-0
                "
                placeholder="SDT"
                value={userProfile.phoneNumber || ""}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    phoneNumber: e.target.value,
                  })
                }
              ></input>
            </div>
          </div>
          <div
            className="
            one-field
            "
          >
            <div className="top-part ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 self-center"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                className="
                left-0
                text-sm
                flex-1
                self-center
                "
              >
                Kĩ năng
              </p>
            </div>
            <div
              className="
              flex
              flex-wrap
              flex-1
              border
              border-slate-200
              transition-all
              ease-in-out
              duration-200
              hover:border-slate-300
              hover:shadow
              rounded
              p-2
              gap-2
              overflow-scroll
              "
            >
              <VarietyBox displayText="KN 1" />
              <VarietyBox displayText="KN 2" />
              <VarietyBox displayText="KN 3" />
              <VarietyBox displayText="KN 4" />
              <VarietyBox displayText="KN 5" />
              <VarietyBox displayText="KN 6" />
              <VarietyBox displayText="KN 7" />
              <VarietyBox displayText="KN 8" />
              <VarietyBox displayText="KN 9" />
              <VarietyBox displayText="KN 10" />
              <VarietyBox displayText="KN 11" />
              <VarietyBox displayText="KN 12" />
              <VarietyBox displayText="KN 13" />
              <VarietyBox displayText="KN 14" />
              <VarietyBox displayText="KN 15" />
              <VarietyBox displayText="KN 16" />
            </div>
          </div>
          <div
            className="
            h-fit
            one-field
            "
          >
            <div className="top-part ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 self-center"
              >
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </svg>
              <p
                className="
                top-0
                left-0
                text-sm
                flex-1
                self-center
                "
              >
                Học vấn
              </p>
              <EditIcon
                displayText="Thêm"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 self-center"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                onClick={() =>
                  setUserProfile({
                    ...userProfile,
                    history: [
                      ...(userProfile.history || []),
                      {
                        type: "EDUCATION",
                        organization: "",
                        title: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      },
                    ],
                  })
                }
                className="w-fit"
              />
            </div>
            <div className="flex flex-col flex-1 h-fit border-slate-200 transition-all ease-in-out duration-200 hover:border-slate-300 hover:shadow rounded p-2 gap-2">
              {(
                (userProfile.history &&
                  userProfile.history.filter(
                    (entry) => entry.type === "EDUCATION"
                  )) ||
                []
              ).map((entry, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 border-b border-gray-200 pb-2"
                >
                  <input
                    placeholder="Trường học"
                    value={entry.organization}
                    onChange={(e) => {
                      const educationEntries = userProfile.history.filter(
                        (entry) => entry.type === "EDUCATION"
                      );
                      const newHistory = [...educationEntries];
                      newHistory[index].organization = e.target.value;
                      setUserProfile({
                        ...userProfile,
                        history: userProfile.history
                          .filter((entry) => entry.type !== "EDUCATION")
                          .concat(newHistory),
                      });
                    }}
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    placeholder="Chuyên ngành"
                    value={entry.title}
                    onChange={(e) => {
                      const educationEntries = userProfile.history.filter(
                        (entry) => entry.type === "EDUCATION"
                      );
                      const newHistory = [...educationEntries];
                      newHistory[index].title = e.target.value;
                      setUserProfile({
                        ...userProfile,
                        history: userProfile.history
                          .filter((entry) => entry.type !== "EDUCATION")
                          .concat(newHistory),
                      });
                    }}
                    className="border px-2 py-1 rounded"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="Ngày bắt đầu"
                      value={entry.startDate}
                      onChange={(e) => {
                        const educationEntries = userProfile.history.filter(
                          (entry) => entry.type === "EDUCATION"
                        );
                        const newHistory = [...educationEntries];
                        newHistory[index].startDate = e.target.value;
                        setUserProfile({
                          ...userProfile,
                          history: userProfile.history
                            .filter((entry) => entry.type !== "EDUCATION")
                            .concat(newHistory),
                        });
                      }}
                      className="border px-2 py-1 rounded flex-1"
                    />
                    <input
                      placeholder="Ngày kết thúc"
                      value={entry.endDate}
                      onChange={(e) => {
                        const educationEntries = userProfile.history.filter(
                          (entry) => entry.type === "EDUCATION"
                        );
                        const newHistory = [...educationEntries];
                        newHistory[index].endDate = e.target.value;
                        setUserProfile({
                          ...userProfile,
                          history: userProfile.history
                            .filter((entry) => entry.type !== "EDUCATION")
                            .concat(newHistory),
                        });
                      }}
                      className="border px-2 py-1 rounded flex-1"
                    />
                  </div>
                  <textarea
                    placeholder="Mô tả thành tích"
                    value={entry.description}
                    onChange={(e) => {
                      const educationEntries = userProfile.history.filter(
                        (entry) => entry.type === "EDUCATION"
                      );
                      const newHistory = [...educationEntries];
                      newHistory[index].description = e.target.value;
                      setUserProfile({
                        ...userProfile,
                        history: userProfile.history
                          .filter((entry) => entry.type !== "EDUCATION")
                          .concat(newHistory),
                      });
                    }}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    className="hover:bg-red-500 flex rounded p-1 px-4 items-center hover:text-white text-red-500 border-2 border-red-500 self-start"
                    onClick={() => {
                      const educationEntries = userProfile.history.filter(
                        (entry) => entry.type === "EDUCATION"
                      );
                      const newHistory = [...educationEntries];
                      newHistory.splice(index, 1);
                      setUserProfile({
                        ...userProfile,
                        history: userProfile.history
                          .filter((entry) => entry.type !== "EDUCATION")
                          .concat(newHistory),
                      });
                    }}
                  >
                    <IoTrash /> Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="h-fit one-field">
            <div className="top-part ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 self-center"
              >
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </svg>
              <p className="top-0 left-0 text-sm flex-1 self-center">
                Kinh nghiệm làm việc
              </p>
              <EditIcon
                displayText="Thêm"
                onClick={() =>
                  setUserProfile({
                    ...userProfile,
                    history: [
                      ...(userProfile.history || []),
                      {
                        type: "EXPERIENCE",
                        organization: "",
                        title: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      },
                    ],
                  })
                }
                icon={<IoIosAddCircle />}
                className="w-fit"
              />
            </div>
            <div className="flex flex-col flex-1 h-fit border-slate-200 transition-all ease-in-out duration-200 hover:border-slate-300 hover:shadow rounded p-2 gap-2">
              {(
                (userProfile.history &&
                  userProfile.history.filter(
                    (entry) => entry.type === "EXPERIENCE"
                  )) ||
                []
              ).map((entry, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 border-b border-gray-200 pb-2"
                >
                  <input
                    placeholder="Công ty"
                    value={entry.organization}
                    onChange={(e) => {
                      const experienceEntries = userProfile.history.filter(
                        (entry) => entry.type === "EXPERIENCE"
                      );
                      const newHistory = [...experienceEntries];
                      newHistory[index].organization = e.target.value;
                      setUserProfile({
                        ...userProfile,
                        history: userProfile.history
                          .filter((entry) => entry.type !== "EXPERIENCE")
                          .concat(newHistory),
                      });
                    }}
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    placeholder="Vị trí"
                    value={entry.title}
                    onChange={(e) => {
                      const experienceEntries = userProfile.history.filter(
                        (entry) => entry.type === "EXPERIENCE"
                      );
                      const newHistory = [...experienceEntries];
                      newHistory[index].title = e.target.value;
                      setUserProfile({
                        ...userProfile,
                        history: userProfile.history
                          .filter((entry) => entry.type !== "EXPERIENCE")
                          .concat(newHistory),
                      });
                    }}
                    className="border px-2 py-1 rounded"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="Ngày bắt đầu"
                      value={entry.startDate}
                      onChange={(e) => {
                        const experienceEntries = userProfile.history.filter(
                          (entry) => entry.type === "EXPERIENCE"
                        );
                        const newHistory = [...experienceEntries];
                        newHistory[index].startDate = e.target.value;
                        setUserProfile({
                          ...userProfile,
                          history: userProfile.history
                            .filter((entry) => entry.type !== "EXPERIENCE")
                            .concat(newHistory),
                        });
                      }}
                      className="border px-2 py-1 rounded flex-1"
                    />
                    <input
                      placeholder="Ngày kết thúc"
                      value={entry.endDate}
                      onChange={(e) => {
                        const experienceEntries = userProfile.history.filter(
                          (entry) => entry.type === "EXPERIENCE"
                        );
                        const newHistory = [...experienceEntries];
                        newHistory[index].endDate = e.target.value;
                        setUserProfile({
                          ...userProfile,
                          history: userProfile.history
                            .filter((entry) => entry.type !== "EXPERIENCE")
                            .concat(newHistory),
                        });
                      }}
                      className="border px-2 py-1 rounded flex-1"
                    />
                  </div>
                  <textarea
                    placeholder="Mô tả công việc"
                    value={entry.description}
                    onChange={(e) => {
                      const experienceEntries = userProfile.history.filter(
                        (entry) => entry.type === "EXPERIENCE"
                      );
                      const newHistory = [...experienceEntries];
                      newHistory[index].description = e.target.value;
                      setUserProfile({
                        ...userProfile,
                        history: userProfile.history
                          .filter((entry) => entry.type !== "EXPERIENCE")
                          .concat(newHistory),
                      });
                    }}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    className="hover:bg-red-500 flex rounded p-1 px-4 items-center hover:text-white text-red-500 border-2 border-red-500 self-start"
                    onClick={() => {
                      const experienceEntries = userProfile.history.filter(
                        (entry) => entry.type === "EXPERIENCE"
                      );
                      const newHistory = [...experienceEntries];
                      newHistory.splice(index, 1);
                      setUserProfile({
                        ...userProfile,
                        history: userProfile.history
                          .filter((entry) => entry.type !== "EXPERIENCE")
                          .concat(newHistory),
                      });
                    }}
                  >
                    <IoTrash /> Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white w-[30%] h-fit rounded-md p-5 shadow-md">
          <div
            className="
          flex
          items-start justify-center
          gap-5
          "
          >
            <AvatarUploader
              userProfile={userProfile}
              accessToken={accessToken}
            />
            <div className="flex flex-col">
              <p
                className="
                raleway-bold text-primary-400
                "
              >
                {userProfile.fullName || "Tên đầy đủ"}
              </p>
              <input
                placeholder="Vị trí mong muốn"
                value={userProfile.position}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, position: e.target.value })
                }
                className="border  border-gray-300 rounded-lg px-3 py-1 focus:outline-0 mt-2 hover:border-primary-400 hover:border-2 focus:border-2 focus:border-primary-400"
              />
              <input
                placeholder="Ngày tháng năm sinh"
                value={userProfile.birthDate}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    birthDate: e.target.value,
                  })
                }
                className="border mb-3 border-gray-300 rounded-lg px-3 py-1 focus:outline-0 mt-2 hover:border-primary-400 hover:border-2 focus:border-2 focus:border-primary-400"
              />
              <CVRadioInput
                label="Giới tính"
                options={["Nam", "Nữ", "Khác"]}
                checked={mapGenderToVn(userProfile.gender) || "Khác"}
                onChange={(value) => {
                  const mapVnToGender = {
                    Nam: "MALE",
                    Nữ: "FEMALE",
                    Khác: "OTHER",
                  };
                  value = mapVnToGender[value];
                  setUserProfile({ ...userProfile, gender: value });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="bg-primary-400 hover:bg-secondary-2-300 rounded-lg py-2 text-white "
              onClick={postUpdate}
            >
              Cập nhật thông tin
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-primary-400 rounded-lg py-2">
              Hủy bỏ
            </button>
          </div>
          {/* <Link to="/courses">
            <button
              className="
              btn
              absolute
              right-6
              top-7
              bg-primary-200
              h-11
              w-36"
            >
              <p
                className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-sm
                text-white
                "
              >
                View courses
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="
                absolute
                size-6
                top-1/2
                -translate-y-1/2
                right-2
                fill-white
                "
              >
                <path
                  fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>*/}
        </div>
      </div>
      <div
        className="
        absolute
        "
      ></div>
      {/*
      Tuổi
      Skills
      - Biểu diễn theo:
        - Sau khi bấm nút "edit" tương ứng hiện ra "chọn" những tag
      Experience
      Loại thời gian công việc mong muốn:
      - Khi edit -> chọn như trên skills
      Khi cập nhật profile:
      - Tự động lưu thông tin nhập
      - or Nút "edit" trên góc
        -> tương tác "edit" riêng cho từng loại
      */}
    </div>
  );
}
