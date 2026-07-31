import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";

const AdminLayout = () => {

    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );

    const [mobileOpen, setMobileOpen] = useState(false);

    const [collapsed, setCollapsed] = useState(false);

    const handleDrawerToggle = () => {

        if (isMobile) {

            setMobileOpen(!mobileOpen);

        } else {

            setCollapsed(!collapsed);

        }

    };

    return (

        <Box sx={{ display: "flex" }}>

            <Header
                onMenuClick={handleDrawerToggle}
            />

            <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                collapsed={collapsed}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    transition: "0.3s",
                }}
            >

                <Toolbar />

                <Outlet />

            </Box>

        </Box>

    );

};

export default AdminLayout;