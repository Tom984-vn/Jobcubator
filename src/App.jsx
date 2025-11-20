import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Home/Homepage";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/Signup";
import ProfilePage from "./pages/Profile/ProfilePage";
import Chat from "./pages/Chat/Chat";
import UserRoutes from "./pages/User/UserRoutes";
import Jobs from "./pages/Findjob/Jobs";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRoutes />}>
          <Route index element={<Homepage />} />
          <Route path="/jobs" element={<Jobs />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
