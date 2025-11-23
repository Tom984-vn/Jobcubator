import SearchBar from "./SearchBar";
import AdvancedFilter from "./AdvancedFilter";
import JobDisplay from "./JobDisplay";
import AskAI from "./AskAI";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxCaretRight } from "react-icons/rx";
export default function Jobs() {
  const [AskData, setAskData] = useState([]);
  return (
    <div className="bg-gray-100 ">
      <SearchBar />
      <div className="relative py-10">
        <div className="flex items-center gap-2 text-md text-gray-500 w-[90%] mx-auto">
          <NavLink className={"raleway-bold text-primary-400"} to={"/"}>
            Trang chủ
          </NavLink>
          <RxCaretRight className="text-xl" />
          <p>Tìm việc</p>
        </div>
        <div className="grid grid-cols-4 w-[90%] mx-auto gap-5">
          <AdvancedFilter />
          <JobDisplay
            addData={(data) => {
              setAskData((datas) => {
                if (datas.find((d) => d.jobname === data.jobname)) {
                  return datas;
                }
                const newDatas = [...datas];
                newDatas.push(data);
                return newDatas;
              });
            }}
          />
        </div>
        <AskAI
          askData={AskData}
          removeData={(job) => {
            setAskData((datas) => {
              return datas.filter((data) => data.jobname !== job.jobname);
            });
          }}
        />
      </div>
    </div>
  );
}
