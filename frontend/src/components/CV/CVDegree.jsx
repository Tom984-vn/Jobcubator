import CVTextInput from "./CVTextinput";
const CVDegreeForm = ({ degree, index, updateDegree }) => {
  return (
    <div className="border-t-10 border-primary-400 pt-5 ">
      <CVTextInput
        label="Tên chứng chỉ"
        placeholder="Nhập tên chứng chỉ bạn đã nhận được"
        value={degree.name}
        onChange={(e) => updateDegree(index, "name", e.target.value)}
      />

      <CVTextInput
        label="Ngày/ Năm nhận"
        placeholder="Nhập thời gian nhận chứng chỉ"
        value={degree.date}
        onChange={(e) => updateDegree(index, "date", e.target.value)}
      />
    </div>
  );
};
export default function CVDegree(props) {
  const updateDegree = (index, key, newValue) => {
    const updatedObj = { ...props.resumeData[index], [key]: newValue };

    props.changeResumeField("certificates", index, updatedObj);
  };
  const addDegree = () => {
    const newDegree = { name: "", date: "" };

    props.changeResumeField("certificates", null, [
      ...(props.resumeData || []),
      newDegree,
    ]);
  };
  const removeDegree = () => {
    if (!props.resumeData || props.resumeData.length <= 0) return;

    props.changeResumeField(
      "certificates",
      null,
      props.resumeData.slice(0, -1)
    );
  };

  return (
    <div className="bg-white p-5 w-[30%] max-h-screen overflow-y-auto sticky top-15">
      <h1 className="raleway-bold text-lg mb-5">Chứng chỉ của bạn</h1>
      {props.resumeData?.map((degree, index) => (
        <CVDegreeForm
          key={index}
          degree={degree}
          index={index}
          updateDegree={updateDegree}
        />
      ))}
      <div className="mt-5 flex gap-3">
        <button
          onClick={addDegree}
          className="border-primary-400 border rounded text-primary-400 hover:bg-primary-400 hover:text-white px-2 p-1"
        >
          Thêm chứng chỉ
        </button>
        <button
          onClick={removeDegree}
          className="border-red-500 border rounded text-red-500 hover:bg-red-500 hover:text-white px-2 p-1"
        >
          Xóa chứng chỉ
        </button>
      </div>
    </div>
  );
}
