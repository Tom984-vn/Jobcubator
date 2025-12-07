import { FaStar } from "react-icons/fa";

export default function Course(props) {
  return (
    <div className="border border-gray-300 w-80 rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ease-in-out cursor-pointer bg-white">
      <img
        src={props.courseData.image}
        alt={props.courseData.title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <div className="flex items-center mb-2">
        <img
          src={props.courseData.providerLogo}
          alt={props.courseData.provider}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="text-sm text-gray-500">
          {props.courseData.provider}
        </span>
      </div>
      <h3 className="text-md font-semibold mb-2">{props.courseData.name}</h3>
      <p className="text-gray-500 mb-4">
        <b className="text-black">Kỹ năng sẽ học:</b>{" "}
        {props.courseData.skills.join(", ")}
      </p>
      <div>
        <span className="flex items-center text-black">
          <FaStar className="mr-1 text-yellow-500" />
          {props.courseData.rating}{" "}
          <span className="text-gray-500">
            ({props.courseData.reviewCount}đánh giá)
          </span>
        </span>
      </div>
    </div>
  );
}
