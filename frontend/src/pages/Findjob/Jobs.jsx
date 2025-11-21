import SearchBar from "./SearchBar";
import AdvancedFilter from "./AdvancedFilter";
import JobDisplay from "./JobDisplay";
import AskAI from "./AskAI";
export default function Jobs() {
  return (
    <div className="bg-gray-100 ">
      <SearchBar />
      <div className="relative py-10">
        <div className="grid grid-cols-4 w-[90%] mx-auto gap-5">
          <AdvancedFilter />
          <JobDisplay />
        </div>
        <AskAI />
      </div>
    </div>
  );
}
