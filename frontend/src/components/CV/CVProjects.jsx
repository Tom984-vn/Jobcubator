import CVTextInput from "./CVTextinput";

import { useState } from "react";

function ProjectForm({ project, index, updateProject }) {
  const handleField = (field, value) => {
    updateProject(index, { ...project, [field]: value });
  };

  const handleDetailChange = (detailIndex, value) => {
    const updatedDetails = [...project.details];
    updatedDetails[detailIndex] = value;

    updateProject(index, { ...project, details: updatedDetails });
  };

  const addDetail = () => {
    updateProject(index, { ...project, details: [...project.details, ""] });
  };

  const removeDetail = () => {
    if (project.details.length > 1) {
      updateProject(index, {
        ...project,
        details: project.details.slice(0, -1),
      });
    }
  };

  return (
    <div className="border-t-10 border-primary-400 pt-5 mb-6">
      <CVTextInput
        label="Tên hoạt động"
        placeholder="Nhập tên hoạt động của bạn"
        value={project.activityName}
        onChange={(e) => handleField("activityName", e.target.value)}
      />

      <CVTextInput
        label="Vai trò"
        placeholder="Nhập vai trò của bạn trong hoạt động"
        value={project.role}
        onChange={(e) => handleField("role", e.target.value)}
      />

      <CVTextInput
        label="Ngày bắt đầu"
        placeholder="Nhập ngày bắt đầu"
        value={project.startDate}
        onChange={(e) => handleField("startDate", e.target.value)}
      />

      <CVTextInput
        label="Ngày kết thúc"
        placeholder="Nhập ngày kết thúc"
        value={project.endDate}
        onChange={(e) => handleField("endDate", e.target.value)}
      />

      {/* DETAILS */}
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Chi tiết hoạt động
        </label>

        {project.details.map((detail, detailIndex) => (
          <div key={detailIndex} className="flex gap-3 mb-2 items-start">
            <input
              type="text"
              placeholder="Nhập chi tiết..."
              value={detail}
              onChange={(e) => handleDetailChange(detailIndex, e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:bg-blue-50 focus:border-primary-400"
            />

            {detailIndex === project.details.length - 1 && (
              <div className="flex gap-2">
                <button
                  className="mt-2 text-lg text-primary-400 border border-primary-400 rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-400 hover:text-white"
                  onClick={addDetail}
                >
                  +
                </button>

                <button
                  className={`mt-2 text-lg text-primary-400 border border-primary-400 rounded-full w-8 h-8 flex items-center justify-center ${
                    project.details.length === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-400 hover:text-white"
                  }`}
                  onClick={removeDetail}
                >
                  -
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CVProjects({ resumeData, changeResumeField }) {
  const projects = resumeData || [];

  const updateProject = (index, updatedProject) => {
    const newProjects = [...projects];
    newProjects[index] = updatedProject;
    changeResumeField("projects", null, newProjects);
  };

  const addProject = () => {
    const newProject = {
      activityName: "",
      role: "",
      startDate: "",
      endDate: "",
      details: [""],
    };
    changeResumeField("projects", null, [...projects, newProject]);
  };

  const removeProject = () => {
    if (projects.length > 0) {
      changeResumeField("projects", null, projects.slice(0, -1));
    }
  };

  return (
    <div className="bg-white p-5 w-[30%] max-h-screen overflow-y-auto sticky top-15">
      <h1 className="raleway-bold text-lg mb-5">Hoạt động của bạn</h1>

      {projects.map((project, index) => (
        <ProjectForm
          key={index}
          project={project}
          index={index}
          updateProject={updateProject}
        />
      ))}

      <div className="mt-5 flex gap-3">
        <button
          onClick={addProject}
          className="border-primary-400 border rounded text-primary-400 hover:bg-primary-400 hover:text-white px-2 p-1"
        >
          Thêm hoạt động
        </button>

        <button
          onClick={removeProject}
          className="border-red-500 border rounded text-red-500 hover:bg-red-500 hover:text-white px-2 p-1"
        >
          Xóa hoạt động
        </button>
      </div>
    </div>
  );
}
