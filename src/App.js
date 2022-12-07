import "./App.css";
import LoginUser from "./Components/Login/LoginUser";
import SigninUser from "./Components/Signin/SigninUser";
import UserDashboard from "./Components/Dashboard/UserDashboard";
import SigninProf from "./Components/Signin/SigninProf";
import LoginProf from "./Components/Login/LoginProf";
import ProfDashboard from "./Components/Dashboard/ProfDashboard";
import SelectUser from "./Components/SelectUser/SelectUser";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import Creators from "./Components/Creators/Creators";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="" element={<SelectUser />}></Route>
          <Route exact path="/LoginUser" element={<LoginUser />}></Route>
          <Route exact path="/SigninUser" element={<SigninUser />}></Route>
          <Route
            exact
            path="/DashboardUser"
            element={<UserDashboard />}
          ></Route>
          <Route exact path="/SigninProf" element={<SigninProf />}></Route>
          <Route exact path="/LoginProf" element={<LoginProf />}></Route>
          <Route
            exact
            path="/ForgotPassword"
            element={<ForgotPassword />}
          ></Route>
          <Route
            exact
            path="/DashboardProf"
            element={<ProfDashboard />}
          ></Route>
          <Route exact path="/Creators" element={<Creators />}></Route>
          <Route exact path="/About" element={<About />}></Route>
          <Route exact path="/Contact" element={<Contact />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
