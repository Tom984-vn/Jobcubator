import SearchBar from "./SearchBar";
import AdvancedFilter from "./AdvancedFilter";
import JobDisplay from "./JobDisplay";
import AskAI from "./AskAI";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RxCaretRight } from "react-icons/rx";
import { fetchJobsByFilter } from "../../utils/Job";
export default function Jobs() {
  const [AskData, setAskData] = useState([]);
  const [filter, setFilter] = useState({});
  const changeFilterField = (field, value) => {
    setFilter((filters) => {
      return { ...filters, [field]: value };
    });
  };
  const [jobData, setJobData] = useState([]);
  useEffect(() => {
    const fetchFilteredJobs = async () => {
      try {
        const data = await fetchJobsByFilter({ page: 0, size: 30 }, filter);
        setJobData(data.content);
      } catch (error) {
        console.error("Error fetching filtered jobs:", error);
      }
    };
    fetchFilteredJobs();
  }, [filter]);
  return (
    <div className="bg-gray-100 ">
      <SearchBar changeFilterField={changeFilterField} filter={filter} />
      <div className="relative py-10">
        <div className="flex items-center gap-2 text-md text-gray-500 w-[90%] mx-auto">
          <NavLink className={"raleway-bold text-primary-400"} to={"/"}>
            Trang chủ
          </NavLink>
          <RxCaretRight className="text-xl" />
          <p>Tìm việc</p>
        </div>
        <div className="grid grid-cols-4 w-[90%] mx-auto gap-5">
          <AdvancedFilter
            changeFilterField={changeFilterField}
            filter={filter}
          />
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
            jobData={jobData}
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
