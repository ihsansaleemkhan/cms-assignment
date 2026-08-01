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

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Public/Home";
import MenuPages from "../pages/Public/MenuPages";
import PageDetail from "../pages/Public/PageDetail";
import PublicNotFound from "../pages/Public/PublicNotFound";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Default Route */}
            <Route
                path="/admin"
                element={
                    localStorage.getItem("token")
                        ? <Navigate to="/admin/dashboard" replace />
                        : <Navigate to="/admin/login" replace />
                }
            />

            {/* Public Route */}
            <Route
                path="/admin/login"
                element={<Login />}
            />

            <Route element={<PublicLayout />}>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/menu/:slug"
                    element={<MenuPages />}
                />

                <Route
                    path="/page/:slug"
                    element={<PageDetail />}
                />

                <Route
                    path="/not-found"
                    element={<PublicNotFound />}
                />

            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>

                <Route element={<AdminLayout />}>

                    <Route
                        path="/admin/dashboard"
                        element={
                            <PermissionRoute permission="dashboard.view">
                                <Dashboard />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/admin/menus"
                        element={
                            <PermissionRoute permission="menu.view">
                                <MenuList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/admin/pages"
                        element={
                            <PermissionRoute permission="page.view">
                                <PagesList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <PermissionRoute permission="user.view">
                                <UserList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/admin/roles"
                        element={
                            <PermissionRoute permission="role.view">
                                <RoleList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/admin/audit-trash"
                        element={
                            <PermissionRoute permission="page.trash.view">
                                <AuditTrashList />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/admin/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/admin/403"
                        element={<Forbidden />}
                    />

                </Route>

            </Route>

            {/* Public 404 */}
            <Route
                path="*"
                element={<PublicNotFound />}
            />

        </Routes>
    );
};

export default AppRoutes;