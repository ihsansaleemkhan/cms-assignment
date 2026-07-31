import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    login,
    me,
} from "../../features/auth/authService";

import { setCredentials } from "../../features/auth/authSlice";


const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
        
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
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

            navigate("/dashboard");

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
                bgcolor: "#f4f6f9",
            }}
        >

            <Paper
                elevation={5}
                sx={{
                    width: 420,
                    p: 5,
                    borderRadius: 3,
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    align="center"
                    gutterBottom
                >
                    CMS Assignment
                </Typography>

                <Typography
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 4 }}
                >
                    Sign in to your account
                </Typography>

                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Password"
                    margin="normal"
                    type={showPassword ? "text" : "password"}
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
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 4, py: 1.5 }}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>

            </Paper>

        </Box>

    );

};


export default Login;