import {
    Box,
    Button,
    Stack,
    Typography,
    alpha,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";

import {
    Link,
    useNavigate,
} from "react-router-dom";

const PublicNotFound = () => {

    const navigate = useNavigate();

    return (

        <Box
            sx={{
                minHeight: "72vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                py: 7,
                bgcolor: "#f7f8fb",
            }}
        >

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 650,
                    textAlign: "center",
                    px: {
                        xs: 2,
                        sm: 4,
                    },
                    py: {
                        xs: 5,
                        sm: 7,
                    },
                    borderRadius: 4,
                    bgcolor: "#fff",
                    border: "1px solid",
                    borderColor: alpha("#14213d", 0.08),
                    boxShadow:
                        "0 18px 48px rgba(15,23,42,0.07)",
                }}
            >

                <Box
                    sx={{
                        width: 82,
                        height: 82,
                        mx: "auto",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha("#1976d2", 0.08),
                        color: "primary.main",
                    }}
                >
                    <SearchOffOutlinedIcon
                        sx={{
                            fontSize: 42,
                        }}
                    />
                </Box>

                <Typography
                    sx={{
                        mt: 3,
                        fontSize: {
                            xs: 64,
                            sm: 82,
                        },
                        fontWeight: 900,
                        color: "primary.main",
                        lineHeight: 1,
                        letterSpacing: -3,
                    }}
                >
                    404
                </Typography>

                <Typography
                    component="h1"
                    sx={{
                        mt: 2,
                        fontSize: {
                            xs: 28,
                            sm: 36,
                        },
                        fontWeight: 900,
                        color: "#10233f",
                        letterSpacing: -0.7,
                    }}
                >
                    Page not found
                </Typography>

                <Typography
                    sx={{
                        mt: 1.5,
                        maxWidth: 500,
                        mx: "auto",
                        color: "text.secondary",
                        fontSize: {
                            xs: 14.5,
                            sm: 16,
                        },
                        lineHeight: 1.75,
                    }}
                >
                    The page you requested does not exist, has been removed,
                    or is not currently available to the public.
                </Typography>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    justifyContent="center"
                    spacing={1.5}
                    sx={{
                        mt: 4,
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            px: 3,
                            py: 1.2,
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 800,
                        }}
                    >
                        Go Back
                    </Button>

                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        startIcon={<HomeOutlinedIcon />}
                        sx={{
                            px: 3,
                            py: 1.25,
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 800,
                            boxShadow:
                                "0 10px 24px rgba(25,118,210,0.24)",
                        }}
                    >
                        Return Home
                    </Button>

                </Stack>

            </Box>

        </Box>

    );

};

export default PublicNotFound;