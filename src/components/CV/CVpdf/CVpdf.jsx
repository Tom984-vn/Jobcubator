export default function CVPdf(props) {
  return (
    <div className="max-h-100vh min-h-screen w-[55%] m-5 overflow-y-scroll shadow-lg bg-white">
      <div
        ref={props.cvRef}
        style={{ backgroundColor: "rgb(255,255,255)" }} // FIX OKLCH
        className="m-5"
      >
        <div className="flex gap-5">
          <img
            src={props.avatarUrl || "/images/defaultAvatar.jpg"}
            className="aspect-3/4 h-50"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {props.resumeData.profile?.fullName}
            </h1>
            <h2 className="text-lg">{props.resumeData.profile?.jobTitle}</h2>
            <div className="font-bold text-sm ml-2 mt-1 space-y-1">
              <p>
                Ngày sinh:{" "}
                <span className="font-normal">
                  {props.resumeData.profile?.birthDate}
                </span>
              </p>
              <p>
                Giới tính:{" "}
                <span className="font-normal">
                  {props.resumeData.profile?.gender}
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="font-normal">
                  {props.resumeData.profile?.email}
                </span>
              </p>
              <p>
                Số điện thoại:{" "}
                <span className="font-normal">
                  {props.resumeData.profile?.phoneNumber}
                </span>
              </p>
              <p>
                Địa chỉ:{" "}
                <span className="font-normal">
                  {props.resumeData.profile?.address}
                </span>
              </p>
              <p>
                Website:{" "}
                <span className="font-normal">
                  {props.resumeData.profile?.website}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Mục tiêu nghề nghiệp */}
        <div className="w-full mt-5">
          <h3
            className="text-lg font-semibold pb-1 mb-2"
            style={{ borderBottom: "1px solid rgb(209,213,219)" }} // border-gray-300
          >
            Mục tiêu nghề nghiệp
          </h3>
          <p className="font-normal text-sm">
            {props.resumeData.workExperience?.careerObjective}
          </p>
        </div>

        {/* Học vấn */}
        <div className="w-full mt-5">
          <h3
            className="text-lg font-semibold pb-1 mb-2"
            style={{ borderBottom: "1px solid rgb(209,213,219)" }}
          >
            Học vấn
          </h3>
          {props.resumeData.education?.map((edu, index) => (
            <div key={index} className="mb-3 flex flex-col sm:flex-row text-sm">
              <p className="w-1/5 col-span-1">
                {edu.startDate} - {edu.endDate}
              </p>
              <div className="w-4/5">
                <h4 className="font-bold">{edu.schoolName}</h4>
                <p className="font-bold">
                  Chuyên ngành: <span className="font-normal">{edu.major}</span>
                </p>
                <p className="font-bold">GPA: {edu.gpa}</p>
                <p className="font-bold">
                  Bằng cấp: <span className="font-normal">{edu.degree}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Kinh nghiệm */}
        <div className="w-full mt-5">
          <h3
            className="text-lg font-semibold pb-1 mb-2"
            style={{ borderBottom: "1px solid rgb(209,213,219)" }}
          >
            Kinh nghiệm làm việc
          </h3>
          <div className="grid">
            {props.resumeData.workExperience?.jobs?.map((job, index) => (
              <div key={index} className="mb-3 grid grid-cols-5 text-sm">
                <p className="text-sm w-60 col-span-1">
                  {job.startDate} - {job.endDate}
                </p>
                <div className="col-span-4">
                  <h4 className="font-bold">
                    {job.position} tại {job.companyName}
                  </h4>
                  <p className="font-bold">
                    Địa điểm:{" "}
                    <span className="font-normal">{job.location}</span>
                  </p>
                  <p className="font-bold">Nhiệm vụ:</p>
                  <ul className="list-disc list-inside">
                    {job.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex} className="font-normal">
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hoạt động */}
        <div className="w-full mt-5">
          <h3
            className="text-lg font-semibold pb-1 mb-2"
            style={{ borderBottom: "1px solid rgb(209,213,219)" }}
          >
            Hoạt động
          </h3>
          {props.resumeData.projects?.map((project, index) => (
            <div key={index} className="mb-3 grid grid-cols-5 text-sm">
              <p className="text-sm col-span-1">
                {project.startDate} - {project.endDate}
              </p>
              <div className="col-span-4">
                <h4 className="font-bold">{project.activityName}</h4>
                <p className="font-bold">
                  <span className="font-bold">{project.role}</span>
                </p>
                <p className="font-bold">Chi tiết:</p>
                <ul className="list-disc list-inside">
                  {project.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="font-normal">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Chứng chỉ */}
        <div className="w-full mt-5">
          <h3
            className="text-lg font-semibold pb-1 mb-2"
            style={{ borderBottom: "1px solid rgb(209,213,219)" }}
          >
            Chứng chỉ
          </h3>
          {props.resumeData.certificates?.map((cert, index) => (
            <div
              key={index}
              className="mb-3 grid grid-cols-5 text-sm pb-1"
              style={{ borderBottom: "1px solid rgb(209,213,219)" }}
            >
              <p className="text-sm col-span-1">{cert.date}</p>
              <div className="col-span-4">
                <h4 className="text-sm">{cert.name}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Giải thưởng */}
        <div className="w-full mt-5 mb-5">
          <h3
            className="text-lg font-semibold pb-1 mb-2"
            style={{ borderBottom: "1px solid rgb(209,213,219)" }}
          >
            Giải thưởng
          </h3>
          {props.resumeData.awards?.map((award, index) => (
            <div
              key={index}
              className="mb-3 grid grid-cols-5 text-sm pb-1"
              style={{ borderBottom: "1px solid rgb(209,213,219)" }}
            >
              <p className="text-sm col-span-1">{award.date}</p>
              <div className="col-span-4">
                <h4>{award.name}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Kỹ năng */}
        <div className="w-full mt-5 mb-5">
          <h3
            className="text-lg font-semibold pb-1 mb-2"
            style={{ borderBottom: "1px solid rgb(209,213,219)" }}
          >
            Kỹ năng
          </h3>
          {props.resumeData.skills?.map((skill, index) => (
            <div
              key={index}
              className="mb-3 grid grid-cols-5 text-sm pb-1"
              style={{ borderBottom: "1px solid rgb(209,213,219)" }}
            >
              <h4 className="font-bold col-span-1">{skill.name}</h4>
              <ul className="list-disc list-inside col-span-4">
                {skill.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="font-normal">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
