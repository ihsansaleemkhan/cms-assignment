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
    Box,
    alpha,
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
import usePermissions from "../../hooks/usePermissions";

const drawerWidth = 250;
const collapsedWidth = 72;

const { hasPermission } = usePermissions();

const menus = [

    {
        text: "Dashboard",
        icon: <Dashboard />,
        path: "/dashboard",
        permission: "dashboard.view",
    },

    {
        text: "Menu",
        icon: <MenuBook />,
        path: "/menus",
        permission: "menu.view",
    },

    {
        text: "Pages",
        icon: <Description />,
        path: "/pages",
        permission: "page.view",
    },

    {
        text: "Roles & Permissions",
        icon: <Security />,
        path: "/roles",
        permission: "role.view",
    },

    {
        text: "Users",
        icon: <People />,
        path: "/users",
        permission: "user.view",
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

    // Smooth transition config for the drawer resizing
    const transitionConfig = theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: isMobile ? 0 : theme.transitions.duration.enteringScreen,
    });

    const drawerContent = (

        <>

            {/* Spacer to push content below the fixed AppBar */}
            <Toolbar sx={{ justifyContent: "center" }} />

            {/* Section Label */}
            <Box
                sx={{
                    px: collapsed && !isMobile ? 0 : 2.5,
                    pt: 2,
                    pb: 1.5,
                }}
            >
                <Typography
                    variant="overline"
                    sx={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "text.disabled",
                        letterSpacing: 1.5,
                        display: collapsed && !isMobile ? "none" : "block",
                    }}
                >
                    MAIN MENU
                </Typography>
            </Box>

            <List
                sx={{
                    px: 1.5,
                    pb: 3,
                }}
            >

                {menus
                .filter(menu => hasPermission(menu.permission))
                .map(menu => (

                    <Tooltip
                        key={menu.text}
                        title={
                            collapsed && !isMobile
                                ? menu.text
                                : ""
                        }
                        placement="right"
                        arrow
                        disableHoverListener={!collapsed || isMobile}
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
                                mb: 0.5,
                                py: 1.2,
                                px: 1.5,
                                borderRadius: 2,
                                color: "text.secondary",
                                borderLeft: "3px solid transparent",
                                transition: "all 0.2s ease-in-out",
                                position: "relative",

                                // Active State
                                "&.active": {
                                    bgcolor: alpha("#1976d2", 0.08),
                                    color: "primary.main",
                                    borderLeft: "3px solid",
                                    borderColor: "primary.main",
                                    
                                    "& .MuiListItemText-primary": {
                                        fontWeight: 700,
                                    },
                                    "& .MuiListItemIcon-root": {
                                        color: "primary.main",
                                    },
                                },

                                // Hover State
                                "&:hover": {
                                    bgcolor: "#f5f7fb",
                                    color: "text.primary",
                                    
                                    // Keep active styling on hover if it's active
                                    "&.active": {
                                        bgcolor: alpha("#1976d2", 0.12),
                                        color: "primary.main",
                                    },

                                    "& .MuiListItemIcon-root": {
                                        color: "inherit",
                                    },
                                },
                            }}
                        >

                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: collapsed && !isMobile ? 0 : 2,
                                    justifyContent: "center",
                                    
                                    "& .MuiSvgIcon-root": {
                                        fontSize: 22,
                                        transition: "transform 0.2s",
                                    },

                                    // Slight icon bump on hover
                                    ".MuiListItemButton-root:hover & .MuiSvgIcon-root": {
                                        transform: "scale(1.1)",
                                    }
                                }}
                            >
                                {menu.icon}
                            </ListItemIcon>

                            {(!collapsed || isMobile) && (

                                <ListItemText
                                    primary={menu.text}
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        lineHeight: 1.2,
                                    }}
                                    sx={{
                                        margin: 0,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
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
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                width: isMobile
                    ? drawerWidth
                    : collapsed
                        ? collapsedWidth
                        : drawerWidth,
                flexShrink: 0,
                transition: transitionConfig,

                "& .MuiDrawer-paper": {
                    width: isMobile
                        ? drawerWidth
                        : collapsed
                            ? collapsedWidth
                            : drawerWidth,
                    transition: transitionConfig,
                    overflowX: "hidden",
                    boxSizing: "border-box",
                    borderRight: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                    // Very subtle inner shadow on the right edge
                    boxShadow: "inset -1px 0 0 rgba(0,0,0,0.04)",
                },
            }}
        >

            {drawerContent}

        </Drawer>

    );

};

export default Sidebar;