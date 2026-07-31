import {
    Drawer,
    Toolbar,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Tooltip,
} from "@mui/material";

import {
    Dashboard,
    Description,
    MenuBook,
    People,
    Security,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 240;
const collapsedWidth = 70;

const menus = [
    {
        text: "Dashboard",
        icon: <Dashboard />,
        path: "/dashboard",
    },
    {
        text: "Menus",
        icon: <MenuBook />,
        path: "/menus",
    },
    {
        text: "Pages",
        icon: <Description />,
        path: "/pages",
    },
    {
        text: "Users",
        icon: <People />,
        path: "/users",
    },
    {
        text: "Roles",
        icon: <Security />,
        path: "/roles",
    },
];

const Sidebar = ({
    mobileOpen,
    handleDrawerToggle,
    collapsed,
}) => {

    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );

    const drawerContent = (

        <>

            <Toolbar
                sx={{
                    justifyContent: "center",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    {collapsed && !isMobile
                        ? "CMS"
                        : "CMS Admin"}
                </Typography>
            </Toolbar>

            <Divider />

            <List
                sx={{
                    mt: 2,
                    px: 1,
                }}
            >

                {menus.map((menu) => (

                    <Tooltip
                        key={menu.text}
                        title={
                            collapsed && !isMobile
                                ? menu.text
                                : ""
                        }
                        placement="right"
                    >

                        <ListItemButton
                            component={NavLink}
                            to={menu.path}
                            onClick={() => {
                                if (isMobile) {
                                    handleDrawerToggle();
                                }
                            }}
                            sx={{
                                mb: 1,
                                borderRadius: 2,

                                "&.active": {
                                    bgcolor: "primary.main",
                                    color: "#fff",

                                    "& .MuiListItemIcon-root": {
                                        color: "#fff",
                                    },
                                },

                                "&:hover": {
                                    bgcolor: "primary.light",
                                    color: "#fff",

                                    "& .MuiListItemIcon-root": {
                                        color: "#fff",
                                    },
                                },
                            }}
                        >

                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: collapsed && !isMobile ? "auto" : 2,
                                    justifyContent: "center",
                                }}
                            >
                                {menu.icon}
                            </ListItemIcon>

                            {(!collapsed || isMobile) && (

                                <ListItemText
                                    primary={menu.text}
                                />

                            )}

                        </ListItemButton>

                    </Tooltip>

                ))}

            </List>

        </>

    );

    return (

        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                width: isMobile
                    ? drawerWidth
                    : collapsed
                        ? collapsedWidth
                        : drawerWidth,

                flexShrink: 0,

                "& .MuiDrawer-paper": {

                    width: isMobile
                        ? drawerWidth
                        : collapsed
                            ? collapsedWidth
                            : drawerWidth,

                    transition: "0.3s",

                    overflowX: "hidden",

                    boxSizing: "border-box",

                    borderRight:
                        "1px solid #e5e7eb",
                },
            }}
        >

            {drawerContent}

        </Drawer>

    );

};

export default Sidebar;