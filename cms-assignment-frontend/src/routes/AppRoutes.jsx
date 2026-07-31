import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import MenuList from "../pages/Menus/MenuList";
import Pages from "../pages/Pages/Pages";
import Users from "../pages/Users/Users";
import Roles from "../pages/Roles/Roles";

import ProtectedRoute from "../components/Common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Default Route */}
            <Route
                path="/"
                element={
                    localStorage.getItem("token")
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />
                }
            />

            {/* Public Route */}
            <Route
                path="/login"
                element={<Login />}
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>

                <Route element={<AdminLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/menus"
                        element={<MenuList />}
                    />

                    <Route
                        path="/pages"
                        element={<Pages />}
                    />

                    <Route
                        path="/users"
                        element={<Users />}
                    />

                    <Route
                        path="/roles"
                        element={<Roles />}
                    />

                </Route>

            </Route>

            {/* 404 */}
            <Route
                path="*"
                element={<h1>404 - Page Not Found</h1>}
            />

        </Routes>
    );
};

export default AppRoutes;