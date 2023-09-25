import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SnackbarProvider} from "notistack";
import Login from "./components/Login";
import Employees from "./components/Employees";
import CreateAttendance from "./components/attendance/Create";
import UpdateAttendance from "./components/attendance/Update";
import Calculation from "./components/Calculation";
import {AuthProvider} from "./contexts/AuthContext";
import Authorization from "./core/Authorization";

function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
              <Authorization>
                  <SnackbarProvider
                      maxSnack={5}
                      anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                      }}
                      autoHideDuration={3000}
                  >
                      <Routes>
                          <Route path="/" element={<Login />} />
                          <Route path="/employees" element={<Employees />} />
                          <Route path="/employee/create" element={<Employees />} />
                          <Route path="/employee/update" element={<Employees />} />
                          <Route path="/employee/delete" element={<Employees />} />
                          <Route path="/attendance/create" element={<CreateAttendance />} />
                          <Route path="/attendance/update" element={<UpdateAttendance />} />
                          <Route path="/attendance/delete" element={<UpdateAttendance />} />
                          <Route path="/calculation" element={<Calculation />} />
                          <Route path="/login" element={<Login />} />
                      </Routes>
                  </SnackbarProvider>
              </Authorization>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
