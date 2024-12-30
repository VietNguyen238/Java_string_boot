import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import UserManagement from "../pages/userManager";
import CompanyManagement from "../pages/companyManager";
import Login from "../pages/login";
import Register from "../pages/register";
import UserForm from "../components/userForm";
import CompanyForm from "../components/companyForm";
import UserDetail from "../pages/userDetail";

const AppRouter: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <Routes>
      {/* Các route công khai */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Các route có Sidebar */}
      {!isAuthPage && (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/users/add" element={<UserForm mode="add" />} />
          <Route path="/users/edit/:id" element={<UserForm mode="edit" />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/companies" element={<CompanyManagement />} />
          <Route path="/companies/add" element={<CompanyForm mode="add" />} />
          <Route
            path="/companies/edit/:id"
            element={<CompanyForm mode="edit" />}
          />
        </>
      )}
    </Routes>
  );
};

export default AppRouter;
