import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employees from "./components/Employees";
import CreateAttendance from "./components/attendance/Create";
import UpdateAttendance from "./components/attendance/Update";
import Calculation from "./components/Calculation";
import {SnackbarProvider} from "notistack";
import Login from "./components/Login";
import {AuthProvider} from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
