import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "./containers/HomePage/HomePage";
import Login from "./containers/Auth/Login/Login";

function DansJob() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
         </Routes>
      </Router>
   );
}

export default DansJob;
