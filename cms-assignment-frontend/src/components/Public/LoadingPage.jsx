import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

const LoadingPage = () => {

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                bgcolor: "#f7f8fb",
            }}
        >

            <CircularProgress
                size={38}
                thickness={4}
            />

            <Typography
                sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "text.secondary",
                }}
            >
                Loading website...
            </Typography>

        </Box>

    );

};

export default LoadingPage;