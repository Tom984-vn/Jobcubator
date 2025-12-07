export default function Role(props) {
  return (
    <div className="bg-white p-2 rounded-lg hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] duration-300">
      <img src={props.roleData.banner} alt={props.roleData.name} />
      <h2 className="text-lg raleway-bold my-2">{props.roleData.name}</h2>
      <p className="text-gray-500 text-sm">{props.roleData.description}</p>
      <p className="font-bold text-sm mt-2">
        Nếu bạn thích:{" "}
        <span className="font-normal text-gray-500">
          {props.roleData.tasks.map((task) => task).join(", ")}
        </span>
      </p>
      <p className="font-bold">Khóa học bao gồm</p>
      <div>
        {props.roleData.courses.slice(0, 2).map((course) => (
          <div
            key={course.id}
            className="mb-4 flex items-center group cursor-pointer mt-2"
          >
            <img
              src={course.logo}
              alt={course.name}
              className="w-8 object-cover border border-gray-300 rounded-lg mr-2"
            />
            <p className="text-blue-600 group-hover:underline">{course.name}</p>
          </div>
        ))}
        {props.roleData.courses.length > 2 && (
          <div className="text-blue-600 cursor-pointer hover:underline">
            + {props.roleData.courses.length - 2} khóa học khác
          </div>
        )}
      </div>
    </div>
  );
}
