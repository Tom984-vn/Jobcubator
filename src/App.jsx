import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Home/Homepage";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/Signup";
import ProfilePage from "./pages/Profile/ProfilePage";
import Chat from "./pages/Chat/Chat";
import UserRoutes from "./pages/User/UserRoutes";
import Jobs from "./pages/Findjob/Jobs";
import JobDetail from "./pages/JobDetail/JobDetail";
import Courses from "./pages/Courses/Courses";
import ResumeBuilder from "./pages/ResumeBuilder/ResumeBuilder";
import ResumeEdit from "./pages/ResumeBuilder/ResumeEdit";
import ResumeDetail from "./pages/ResumeBuilder/ResumeDetail";
import MyResume from "./pages/ResumeBuilder/MyResume";
import EmployerJobs from "./pages/Employer/EmployerJobs";
import EmployerRoute from "./pages/Employer/EmployerRoute";
import EmployerHomePage from "./pages/Employer/EmployerHomePage";
import EmployerAddJob from "./pages/Employer/EmployerAddJob";
import Applicants from "./pages/Employer/Applicants";
import EmployerJobDetail from "./pages/Employer/EmployerJobDetail";
import MyApplications from "./pages/Findjob/MyApplications";
import ChatPage from "./pages/Employer/Chat";
import JobSuggestions from "./pages/Findjob/JobSuggestions";
import CompanyProfile from "./pages/Employer/CompanyProfile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRoutes />}>
          <Route index element={<Homepage />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="jobs/applied" element={<MyApplications />} />
          <Route path="courses" element={<Courses />} />
          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="resume-builder/edit" element={<ResumeEdit />} />
          <Route
            path="resume-builder/edit/:method"
            element={<ResumeDetail />}
          />
          <Route path="jobs/suggestions" element={<JobSuggestions />} />
          <Route path="resume-builder/myCV" element={<MyResume />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
        <Route path="/employer" element={<EmployerRoute />}>
          <Route index element={<CompanyProfile />} />
          <Route path="jobs" element={<EmployerJobs />} />
          <Route path="jobs/add" element={<EmployerAddJob />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="jobs/:id" element={<EmployerJobDetail />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
