import { FaFilter } from "react-icons/fa6";
const RadioOption = (props) => {
  const uniqueId = props.name + "-" + props.nameFor; // prevents conflict

  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <input
        id={uniqueId}
        type="radio"
        name={props.nameFor}
        onClick={() => {
          props.setValue && props.setValue(props.category, props.name);
        }}
        className="
          appearance-none w-4 h-4 rounded-full
          border-3 border-gray-500
          bg-white
          checked:border-white
          checked:bg-primary-400
          checked:ring-2 checked:ring-primary-400
          transition-all duration-150
        "
      />

      <label
        htmlFor={uniqueId}
        className="
          group-hover:text-primary-400
          group-hover:font-bold
          transition-all duration-150
        "
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
        <RadioOption name="Tất cả" nameFor="experience" />
        <RadioOption name="Không yêu cầu" nameFor="experience" />
        <RadioOption name="Dưới 1 năm" nameFor="experience" />
        <RadioOption name="1 năm" nameFor="experience" />
        <RadioOption name="2 năm" nameFor="experience" />
        <RadioOption name="3 năm" nameFor="experience" />
        <RadioOption name="4 năm" nameFor="experience" />
        <RadioOption name="5 năm" nameFor="experience" />
        <RadioOption name="Trên 5 năm" nameFor="experience" />
      </div>
      <h2 className="raleway-bold py-2 text-md">Mức lương</h2>

      <div className="grid grid-cols-2 gap-2">
        <RadioOption name="Tất cả" nameFor="salary" />
        <RadioOption name="Dưới 10 triệu" nameFor="salary" />
        <RadioOption name="10-15 triệu" nameFor="salary" />
        <RadioOption name="15-20 triệu" nameFor="salary" />
        <RadioOption name="20-25 triệu" nameFor="salary" />
        <RadioOption name="25-30 triệu" nameFor="salary" />
        <RadioOption name="30-50 triệu" nameFor="salary" />
        <RadioOption name="Trên 50 triệu" nameFor="salary" />
        <RadioOption name="Thỏa thuận" nameFor="salary" />
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
        <RadioOption name="Tất cả" nameFor="type" />
        <RadioOption name="Toàn thời gian" nameFor="type" />
        <RadioOption name="Bán thời gian" nameFor="type" />
        <RadioOption name="Thực tập" nameFor="type" />
        <RadioOption name="Khác" nameFor="type" />
      </div>
    </div>
  );
}
