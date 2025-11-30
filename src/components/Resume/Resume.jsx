import { useNavigate } from "react-router-dom";
export default function Resume(props) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/resume-builder/edit`)}
      className="bg-gray-200 group p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 cursor-pointer hover:border-primary-400 hover:border hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={props.exampleImage}
          alt={props.name}
          className="w-full h-auto rounded-md shadow-md"
        />
        <button className="opacity-0 group-hover:opacity-100 mt-2 px-4 py-2 bg-secondary-2-300 w-[95%] hover:bg-secondary-2-400 text-white rounded-md transition-all duration-300 absolute bottom-2 left-1/2 transform -translate-x-1/2  ">
          Dùng mẫu
        </button>
      </div>
      <h3 className="text-lg raleway-bold mt-4 text-center">{props.name}</h3>
      {props.tags.map((tag) => {
        return (
          <span
            className="inline-block bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full mr-2 mt-2"
            key={tag}
          >
            {tag}
          </span>
        );
      })}
    </div>
  );
}
