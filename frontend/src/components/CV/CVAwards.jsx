import CVTextInput from "./CVTextinput";
const AwardsForm = (props) => {
  return (
    <div className="border-t-10 border-primary-400 pt-5 ">
      <CVTextInput
        label="Tên giải thưởng"
        placeholder="Nhập tên giải thưởng bạn đã nhận được"
        value={props.award.name}
        onChange={(e) => props.updateAward(props.index, "name", e.target.value)}
      />
      <CVTextInput
        label="Ngày/ Năm nhận"
        placeholder="Nhập thời gian nhận giải thưởng"
        value={props.award.date}
        onChange={(e) => props.updateAward(props.index, "date", e.target.value)}
      />
    </div>
  );
};
export default function CVAwards(props) {
  const updateAward = (index, key, newValue) => {
    const updatedObj = { ...props.resumeData[index], [key]: newValue };

    props.changeResumeField("awards", index, updatedObj);
  };
  const addAward = () => {
    const newAward = { name: "", date: "" };

    props.changeResumeField("awards", null, [
      ...(props.resumeData || []),
      newAward,
    ]);
  };
  const removeAward = () => {
    if (!props.resumeData || props.resumeData.length <= 0) return;

    props.changeResumeField("awards", null, props.resumeData.slice(0, -1));
  };

  return (
    <div className="bg-white p-5 w-[30%] max-h-screen overflow-y-auto sticky top-15">
      <h1 className="raleway-bold text-lg mb-5">Danh hiệu và giải thưởng</h1>
      {props.resumeData?.map((award, index) => (
        <AwardsForm
          key={index}
          award={award}
          index={index}
          updateAward={updateAward}
        />
      ))}
      <div className="mt-5 flex gap-3">
        <button
          onClick={addAward}
          className="border-primary-400 border rounded text-primary-400 hover:bg-primary-400 hover:text-white px-2 p-1"
        >
          Thêm giải thưởng
        </button>
        <button
          onClick={removeAward}
          className="border-red-500 border rounded text-red-500 hover:bg-red-500 hover:text-white px-2 p-1"
        >
          Xóa giải thưởng
        </button>
      </div>
    </div>
  );
}
