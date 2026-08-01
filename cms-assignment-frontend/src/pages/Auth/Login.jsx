import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    alpha,
    CircularProgress,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
    WebAsset,
} from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    login,
} from "../../features/auth/authService";

import { setCredentials } from "../../features/auth/authSlice";

// Shared modern input styles
const inputStyles = {
    bgcolor: alpha("#000", 0.03),
    borderRadius: 2.5,
    fontSize: 14,
    "&:hover": {
        bgcolor: alpha("#000", 0.05),
    },
    "&.Mui-focused": {
        bgcolor: "#fff",
        boxShadow: "0 0 0 3px rgba(25,118,210,0.1)",
    },
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "transparent" },
    "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        borderWidth: 1.5,
    },
};

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            setLoading(true);

            const response = await login({
                email,
                password,
            });

            dispatch(
                setCredentials({
                    token: response.token,
                    user: response.user,
                })
            );

            toast.success(`Welcome ${response.user.name}`);

            navigate("/admin/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                // Modern gradient background
                background: "linear-gradient(135deg, #f5f7fb 0%, #e3e9f2 100%)",
            }}
        >
            {/* Decorative Background Shapes */}
            <Box
                sx={{
                    position: "absolute",
                    top: -150,
                    right: -100,
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(25,118,210,0.02) 100%)",
                    filter: "blur(60px)",
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: -100,
                    left: -100,
                    width: 400,
                    height: 400,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(66,165,245,0.1) 0%, rgba(66,165,245,0.01) 100%)",
                    filter: "blur(50px)",
                    zIndex: 0,
                }}
            />

            {/* Login Card */}
            <Paper
                elevation={0}
                sx={{
                    width: 440,
                    maxWidth: "95vw",
                    p: 4.5,
                    borderRadius: 4,
                    zIndex: 1,
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.06)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset",
                    bgcolor: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(20px)",
                }}
            >
                {/* ── Brand Header ── */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 5,
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 3.5,
                            background: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 24px rgba(25,118,210,0.35)",
                            mb: 2.5,
                        }}
                    >
                        <WebAsset sx={{ fontSize: 36, color: "#fff" }} />
                    </Box>

                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: 24,
                            color: "text.primary",
                            lineHeight: 1,
                            letterSpacing: -0.5,
                        }}
                    >
                        CMS
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: "primary.main",
                            letterSpacing: 2.5,
                            textTransform: "uppercase",
                            mt: 0.5,
                        }}
                    >
                        Page Builder
                    </Typography>
                </Box>

                {/* ── Form ── */}
                <Box component="form" onSubmit={handleLogin} noValidate>
                    <TextField
                        fullWidth
                        placeholder="Email address"
                        margin="normal"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": inputStyles,
                        }}
                    />

                    <TextField
                        fullWidth
                        placeholder="Password"
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            edge="end"
                                            sx={{
                                                color: "#9aa0aa",
                                                "&:hover": {
                                                    color: "text.primary",
                                                },
                                            }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff sx={{ fontSize: 20 }} />
                                            ) : (
                                                <Visibility sx={{ fontSize: 20 }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": inputStyles,
                        }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                            mt: 3.5,
                            py: 1.5,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 15,
                            borderRadius: 2.5,
                            boxShadow: "0 4px 14px rgba(25,118,210,0.35)",
                            "&:hover": {
                                boxShadow: "0 6px 20px rgba(25,118,210,0.45)",
                                bgcolor: "primary.dark",
                            },
                            "&.Mui-disabled": {
                                bgcolor: "primary.main",
                                color: "#fff",
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: "#fff" }} />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </Box>

                {/* Footer Text */}
                <Typography
                    variant="caption"
                    display="block"
                    align="center"
                    sx={{
                        mt: 4,
                        color: "#9aa0aa",
                        fontSize: 12,
                        fontWeight: 500,
                    }}
                >
                    Secure administration portal
                </Typography>

            </Paper>

        </Box>

    );

};

export default Login;