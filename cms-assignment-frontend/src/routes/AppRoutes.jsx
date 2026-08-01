import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import MenuList from "../pages/Menus/MenuList";
import PagesList from "../pages/Pages/PageList";
import UserList from "../pages/Users/UserList";
import RoleList from "../pages/Roles/RoleList";
import Profile from "../pages/Profile/Profile";
import AuditTrashList from "../pages/AuditTrash/AuditTrashList";

import ProtectedRoute from "../components/Common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

import PermissionRoute from "../components/Common/PermissionRoute";
import Forbidden from "../pages/Common/Forbidden";

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
                        element={
                            <PermissionRoute permission="dashboard.view">
                                <Dashboard />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/menus"
                        element={
                            <PermissionRoute permission="menu.view">
                                <MenuList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/pages"
                        element={
                            <PermissionRoute permission="page.view">
                                <PagesList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <PermissionRoute permission="user.view">
                                <UserList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/roles"
                        element={
                            <PermissionRoute permission="role.view">
                                <RoleList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/audit-trash"
                        element={
                            <PermissionRoute permission="page.trash.view">
                                <AuditTrashList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/403"
                        element={<Forbidden />}
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