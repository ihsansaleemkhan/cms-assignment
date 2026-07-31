import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
} from "@mui/material";

import {
    Logout,
    Person,
    Menu as MenuIcon,
} from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logout } from "../../features/auth/authService";
import { logoutUser } from "../../features/auth/authSlice";

const Header = ({ onMenuClick }) => {

    const user = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {

        try {

            await logout();

        } catch (error) {
            // Ignore API logout failure
        }

        dispatch(logoutUser());

        toast.success("Logged out successfully");

        navigate("/login");
    };

    return (
        <AppBar
            position="fixed"
            elevation={1}
            sx={{
                zIndex: 1201,
            }}
        >
            <Toolbar>

                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    CMS Assignment
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >

                    <Box sx={{ textAlign: "right" }}>
                        <Typography fontWeight={600}>
                            {user?.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="inherit"
                            sx={{ opacity: 0.8 }}
                        >
                            {user?.roles?.[0]}
                        </Typography>
                    </Box>

                    <IconButton
                        color="inherit"
                        onClick={handleMenuOpen}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "secondary.main",
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >

                        <Box
                            sx={{
                                px: 2,
                                py: 1,
                            }}
                        >
                            <Typography fontWeight="bold">
                                {user?.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {user?.email}
                            </Typography>
                        </Box>

                        <Divider />

                        <MenuItem
                            onClick={handleMenuClose}
                        >
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>

                            Profile
                        </MenuItem>

                        <MenuItem
                            onClick={handleLogout}
                        >
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>

                            Logout
                        </MenuItem>

                    </Menu>

                </Box>

            </Toolbar>
        </AppBar>
    );
};

export default Header;