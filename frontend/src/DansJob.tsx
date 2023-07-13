import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "./containers/HomePage/HomePage";
import Login from "./containers/Auth/Login/Login";
import DetailJob from "./containers/DetailJob/DetailJob";

function DansJob() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/:id" element={<DetailJob />} />
         </Routes>
      </Router>
   );
}

export default DansJob;
