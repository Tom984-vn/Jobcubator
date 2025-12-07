export default function CVSidebar(props) {
  return (
    <div className="w-[15%] bg-white p-6 shadow-md flex-col flex border-r border-gray-300 h-screen sticky top-10">
      <ul>
        <li
          className="mb-4"
          onClick={() => {
            props.setCurrentSection("profile");
          }}
        >
          <p
            className={`relative text-primary-400 cursor-pointer w-fit
    after:content-[''] after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-secondary-2-300 after:transition-all after:duration-300
    hover:after:w-full ${
      props.currentSection === "profile"
        ? "after:w-full text-secondary-2-300"
        : ""
    }`}
          >
            Thông tin cá nhân
          </p>
        </li>

        <li
          className="mb-4"
          onClick={() => {
            props.setCurrentSection("education");
          }}
        >
          <p
            className={`relative text-primary-400 cursor-pointer w-fit
    after:content-[''] after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-secondary-2-300 after:transition-all after:duration-300
    hover:after:w-full ${
      props.currentSection === "education"
        ? "after:w-full text-secondary-2-300"
        : ""
    }`}
          >
            Học vấn
          </p>
        </li>
        <li
          className="mb-4"
          onClick={() => {
            props.setCurrentSection("workExperience");
          }}
        >
          <p
            className={`relative text-primary-400 cursor-pointer w-fit
    after:content-[''] after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-secondary-2-300 after:transition-all after:duration-300
    hover:after:w-full ${
      props.currentSection === "workExperience"
        ? "after:w-full text-secondary-2-300"
        : ""
    }`}
          >
            Kinh nghiệm làm việc
          </p>
        </li>

        <li
          className="mb-4"
          onClick={() => {
            props.setCurrentSection("projects");
          }}
        >
          <p
            className={`relative text-primary-400 cursor-pointer w-fit
    after:content-[''] after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-secondary-2-300 after:transition-all after:duration-300
    hover:after:w-full ${
      props.currentSection === "projects"
        ? "after:w-full text-secondary-2-300"
        : ""
    }`}
          >
            Hoạt động
          </p>
        </li>
        <li
          className="mb-4"
          onClick={() => {
            props.setCurrentSection("certificates");
          }}
        >
          <p
            className={`relative text-primary-400 cursor-pointer w-fit
    after:content-[''] after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-secondary-2-300 after:transition-all after:duration-300
    hover:after:w-full ${
      props.currentSection === "certificates"
        ? "after:w-full text-secondary-2-300"
        : ""
    }`}
          >
            Chứng chỉ
          </p>
        </li>
        <li
          className="mb-4"
          onClick={() => {
            props.setCurrentSection("awards");
          }}
        >
          <p
            className={`relative text-primary-400 cursor-pointer w-fit
    after:content-[''] after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-secondary-2-300 after:transition-all after:duration-300
    hover:after:w-full ${
      props.currentSection === "awards"
        ? "after:w-full text-secondary-2-300"
        : ""
    }`}
          >
            Giải thưởng
          </p>
        </li>
        <li
          className="mb-4"
          onClick={() => {
            props.setCurrentSection("skills");
          }}
        >
          <p
            className={`relative text-primary-400 cursor-pointer w-fit
    after:content-[''] after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-secondary-2-300 after:transition-all after:duration-300
    hover:after:w-full ${
      props.currentSection === "skills"
        ? "after:w-full text-secondary-2-300"
        : ""
    }`}
          >
            Kỹ năng
          </p>
        </li>
      </ul>
      <button
        onClick={() => {
          props.uploadPDF();
        }}
        className="bg-primary-400 rounded-full text-white raleway-bold p-2 hover:bg-secondary-2-300 mt-2"
      >
        Tạo CV
      </button>
      <button
        onClick={() => {
          props.exportPDF();
        }}
        className="bg-gray-300 rounded-full text-black raleway-bold p-2 hover:bg-gray-400 mt-4"
      >
        Xuất PDF
      </button>
    </div>
  );
}
