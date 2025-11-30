import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import GeneralChat from "../../components/Chat/GeneralChat";

export default function UserRoutes() {
  const currentLocation = window.location.pathname;
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
      {currentLocation !== "/jobs" && <GeneralChat />}
    </>
  );
}
