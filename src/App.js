import "./App.css";
import LoginUser from "./Components/Login/LoginUser";
import SigninUser from "./Components/Signin/SigninUser";
import UserDashboard from "./Components/Dashboard/UserDashboard";
import SigninProf from "./Components/Signin/SigninProf";
import LoginProf from "./Components/Login/LoginProf";
import ProfDashboard from "./Components/Dashboard/ProfDashboard";
import SelectUser from "./Components/SelectUser/SelectUser";

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
            path="/DashboardProf"
            element={<ProfDashboard />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
