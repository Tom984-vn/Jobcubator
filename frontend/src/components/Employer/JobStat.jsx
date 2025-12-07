export default function JobStat(props) {
  return (
    <div
      className={`p-5 rounded-lg shadow-md w-full flex gap-4 items-center justify-center ${props.className}`}
    >
      {props.icon}
      <div>
        <p className="text-2xl raleway-bold mt-2">{props.count}</p>
        <p className="">{props.label}</p>
      </div>
    </div>
  );
}
