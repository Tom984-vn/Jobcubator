import CVRadioInput from "./CVRadioInput";
import CVTextInput from "./CVTextinput";

export default function CVProfileForm({ resumeData, changeResumeField }) {
  return (
    <div className="bg-white p-5 w-[30%] max-h-screen sticky top-15 overflow-y-scroll">
      <h1 className="raleway-bold text-lg mb-5">Thông tin cá nhân của bạn</h1>
      <CVTextInput
        label="Họ và tên"
        placeholder="Nhập họ và tên của bạn"
        value={resumeData?.fullName}
        onChange={(event) => {
          changeResumeField("profile", "fullName", event.target.value);
        }}
      />
      <CVTextInput
        label="Chức danh"
        placeholder="Nhập chức danh của bạn"
        value={resumeData?.jobTitle}
        onChange={(event) => {
          changeResumeField("profile", "jobTitle", event.target.value);
        }}
      />
      <CVTextInput
        label="Ngày sinh"
        placeholder="DD/MM/YYYY"
        value={resumeData?.birthDate}
        onChange={(event) => {
          changeResumeField("profile", "birthDate", event.target.value);
        }}
      />
      <CVRadioInput
        label="Giới tính"
        options={["Nam", "Nữ", "Khác"]}
        checked={resumeData?.gender}
        onChange={(value) => {
          changeResumeField("profile", "gender", value);
        }}
      />
      <CVTextInput
        label="Email"
        placeholder="Nhập email của bạn"
        value={resumeData?.email}
        onChange={(event) => {
          changeResumeField("profile", "email", event.target.value);
        }}
      />
      <CVTextInput
        label="Số điện thoại"
        placeholder="Nhập số điện thoại của bạn"
        value={resumeData?.phoneNumber}
        onChange={(event) => {
          changeResumeField("profile", "phoneNumber", event.target.value);
        }}
      />
      <CVTextInput
        label="Địa chỉ"
        placeholder="Nhập địa chỉ của bạn"
        value={resumeData?.address}
        onChange={(event) => {
          changeResumeField("profile", "address", event.target.value);
        }}
      />
      <CVTextInput
        label="Website"
        placeholder="Nhập website cá nhân của bạn"
        value={resumeData?.website}
        onChange={(event) => {
          changeResumeField("profile", "website", event.target.value);
        }}
      />
    </div>
  );
}
