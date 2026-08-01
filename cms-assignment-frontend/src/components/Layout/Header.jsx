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
    Tooltip,
    Chip,
    alpha,
} from "@mui/material";

import {
    Logout,
    Person,
    Menu as MenuIcon,
    KeyboardArrowDown,
    WebAsset,
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

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                zIndex: 1201,
                bgcolor: "primary.main",
                backgroundImage:
                    "linear-gradient(135deg, #1565c0 0%, #1976d2 40%, #1e88e5 100%)",
                borderBottom: "1px solid",
                borderColor: alpha("#fff", 0.1),
                boxShadow: "0 2px 12px rgba(25,118,210,0.3)",
            }}
        >
            <Toolbar sx={{ gap: 1.5, px: { xs: 2, sm: 3 } }}>

                {/* ── Hamburger ── */}
                <IconButton
                    onClick={onMenuClick}
                    sx={{
                        color: "#fff",
                        mr: 0.5,
                        "&:hover": {
                            bgcolor: alpha("#fff", 0.12),
                        },
                    }}
                >
                    <MenuIcon fontSize="small" />
                </IconButton>

                {/* ── Brand ── */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        mr: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2.5,
                            bgcolor: alpha("#fff", 0.18),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid",
                            borderColor: alpha("#fff", 0.15),
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        <WebAsset
                            sx={{ fontSize: 22, color: "#fff" }}
                        />
                    </Box>

                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 17,
                                lineHeight: 1.15,
                                color: "#fff",
                                letterSpacing: -0.3,
                            }}
                        >
                            Ihsan Saleemkhan
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 9.5,
                                fontWeight: 600,
                                color: alpha("#fff", 0.65),
                                letterSpacing: 1.8,
                                textTransform: "uppercase",
                                lineHeight: 1,
                            }}
                        >
                            Page Builder
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* ── Right Section ── */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    {/* Profile Button */}
                    <Box
                        onClick={handleMenuOpen}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            px: 1.5,
                            py: 0.6,
                            borderRadius: 2.5,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            border: "1px solid",
                            borderColor: "transparent",
                            "&:hover": {
                                bgcolor: alpha("#fff", 0.12),
                                borderColor: alpha("#fff", 0.15),
                            },
                        }}
                    >
                        <Box sx={{ position: "relative" }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: alpha("#fff", 0.22),
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#fff",
                                    border: "2px solid",
                                    borderColor: alpha("#fff", 0.3),
                                }}
                            >
                                {getInitials(user?.name)}
                            </Avatar>
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: -1,
                                    right: -1,
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor: "#66bb6a",
                                    border: "2px solid #1565c0",
                                }}
                            />
                        </Box>

                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
                            <Typography
                                sx={{
                                    fontSize: 13.5,
                                    fontWeight: 700,
                                    color: "#fff",
                                    lineHeight: 1.2,
                                }}
                            >
                                {user?.name}
                            </Typography>
                            <Chip
                                label={user?.roles?.[0] || "User"}
                                size="small"
                                sx={{
                                    height: 18,
                                    fontSize: 10,
                                    fontWeight: 600,
                                    bgcolor: alpha("#fff", 0.15),
                                    color: "#fff",
                                    "& .MuiChip-label": {
                                        px: 1,
                                    },
                                }}
                            />
                        </Box>

                        <KeyboardArrowDown
                            sx={{
                                fontSize: 18,
                                color: alpha("#fff", 0.7),
                                display: { xs: "none", sm: "block" },
                                transition: "transform 0.2s",
                                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        />
                    </Box>

                    {/* Dropdown Menu */}
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
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,
                                    width: 260,
                                    borderRadius: 3,
                                    border: "1px solid",
                                    borderColor: "rgba(0,0,0,0.06)",
                                    boxShadow:
                                        "0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)",
                                    overflow: "visible",
                                    "&:before": {
                                        content: '""',
                                        position: "absolute",
                                        top: -6,
                                        right: 20,
                                        width: 12,
                                        height: 12,
                                        bgcolor: "#fff",
                                        border: "1px solid rgba(0,0,0,0.06)",
                                        borderBottom: "none",
                                        borderRight: "none",
                                        transform: "rotate(45deg)",
                                        zIndex: 0,
                                    },
                                },
                            },
                        }}
                        MenuListProps={{
                            sx: { p: 0.5, position: "relative", zIndex: 1 },
                        }}
                    >
                        {/* User Info Card */}
                        <Box
                            sx={{
                                px: 2,
                                py: 2,
                                mb: 0.5,
                                borderRadius: 2,
                                bgcolor: alpha("#1976d2", 0.04),
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    mb: 1.5,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        bgcolor:
                                            "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: "#fff",
                                    }}
                                >
                                    {getInitials(user?.name)}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: 14,
                                            color: "text.primary",
                                            lineHeight: 1.2,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {user?.name}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: "text.secondary",
                                            lineHeight: 1.3,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {user?.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Chip
                                label={user?.roles?.[0] || "User"}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    bgcolor: alpha("#1976d2", 0.1),
                                    color: "primary.main",
                                }}
                            />
                        </Box>

                        <Divider sx={{ my: 0.5, borderColor: "rgba(0,0,0,0.06)" }} />

                        <MenuItem
                             onClick={() => {

                                handleMenuClose();

                                navigate("/profile");

                            }}
                            sx={{
                                borderRadius: 2,
                                mx: 0.5,
                                my: 0.25,
                                py: 1.1,
                                px: 1.5,
                                "&:hover": {
                                    bgcolor: alpha("#1976d2", 0.06),
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 36,
                                    "& .MuiSvgIcon-root": {
                                        fontSize: 19,
                                    },
                                }}
                            >
                                <Person />
                            </ListItemIcon>
                            <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>
                                My Profile
                            </Typography>
                        </MenuItem>

                        <Divider sx={{ my: 0.5, borderColor: "rgba(0,0,0,0.06)" }} />

                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                borderRadius: 2,
                                mx: 0.5,
                                my: 0.25,
                                py: 1.1,
                                px: 1.5,
                                "&:hover": {
                                    bgcolor: alpha("#d32f2f", 0.06),
                                    color: "#d32f2f",
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 36,
                                    "& .MuiSvgIcon-root": {
                                        fontSize: 19,
                                    },
                                }}
                            >
                                <Logout />
                            </ListItemIcon>
                            <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>
                                Logout
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;