import { FaFilter } from "react-icons/fa6";
const RadioOption = (props) => {
  return (
    <div className="flex items-center gap-2 group">
      <input
        id={props.name}
        type="radio"
        onClick={() => {
          props.setValue(props.category, props.name);
        }}
        name={props.for}
        className="group-hover:outline-primary-400 focus:outline-primary-400 group-hover:outline-2 appearance-none w-4 h-4 rounded-full focus:bg-primary-400 border-white border-3 outline-2 outline-gray-500"
      />
      <label
        for={props.name}
        className="group-hover:text-primary-400 group-hover:font-bold group-focus:text-primary-400"
      >
        {props.name}
      </label>
    </div>
  );
};
export default function AdvancedFilter() {
  return (
    <div className="col-span-1">
      <h1 className="flex items-center raleway-bold text-xl gap-2 border-b border-gray-300 py-1">
        <FaFilter className="text-primary-400 " />
        Lọc nâng cao
      </h1>
      <h2 className="raleway-bold py-2 text-md">Kinh nghiệm</h2>
      <div className="grid grid-cols-2 gap-2">
        <RadioOption name="Tất cả" for="experience" />
        <RadioOption name="Không yêu cầu" for="experience" />
        <RadioOption name="Dưới 1 năm" for="experience" />
        <RadioOption name="1 năm" for="experience" />
        <RadioOption name="2 năm" for="experience" />
        <RadioOption name="3 năm" for="experience" />
        <RadioOption name="4 năm" for="experience" />
        <RadioOption name="5 năm" for="experience" />
        <RadioOption name="Trên 5 năm" for="experience" />
      </div>
      <h2 className="raleway-bold py-2 text-md">Mức lương</h2>

      <div className="grid grid-cols-2 gap-2">
        <RadioOption name="Tất cả" for="salary" />
        <RadioOption name="Dưới 10 triệu" for="salary" />
        <RadioOption name="10-15 triệu" for="salary" />
        <RadioOption name="15-20 triệu" for="salary" />
        <RadioOption name="20-25 triệu" for="salary" />
        <RadioOption name="25-30 triệu" for="salary" />
        <RadioOption name="30-50 triệu" for="salary" />
        <RadioOption name="Trên 50 triệu" for="salary" />
        <RadioOption name="Thỏa thuận" for="salary" />
      </div>
      <div className="grid grid-cols-8 w-full my-3 gap-2">
        <input
          type="number"
          placeholder="Từ"
          className="rounded-full bg-white border-1 col-span-3 border-gray-300 p-1 px-3  focus:outline-0 hover:border-primary-400 hover:border-2 focus:border-2 focus:border-primary-400"
        />
        <p className="col-span-1 text-gray-500 text-center">-</p>
        <input
          type="number"
          placeholder="Đến"
          className="rounded-full bg-white col-span-3 border-1 border-gray-300 p-1 px-3 focus:outline-0 hover:border-primary-400 hover:border-2 focus:border-2 focus:border-primary-400"
        />
        <p className="col-span-1 text-gray-500">triệu</p>
      </div>
      <button className="text-center rounded-full bg-secondary-2-200 p-1 text-white w-full hover:bg-secondary-2-400">
        Lựa chọn
      </button>
      <h2 className="raleway-bold py-2 text-md">Hình thức làm việc</h2>
      <div className="grid grid-cols-2 gap-2">
        <RadioOption name="Tất cả" for="type" />
        <RadioOption name="Toàn thời gian" for="type" />
        <RadioOption name="Bán thời gian" for="type" />
        <RadioOption name="Thực tập" for="type" />
        <RadioOption name="Khác" for="type" />
      </div>
    </div>
  );
}
