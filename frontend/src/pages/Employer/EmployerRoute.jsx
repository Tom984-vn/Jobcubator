import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Employer/Sidebar";
import TopBar from "../../components/Employer/Topbar";

export default function EmployerRoute() {
  return (
    <div>
      <TopBar />
      <div className="bg-blue-50 flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
