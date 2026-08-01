import {
    Box,
    Typography,
    Button,
} from "@mui/material";

import BlockIcon from "@mui/icons-material/Block";

import { useNavigate } from "react-router-dom";

const Forbidden = () => {

    const navigate = useNavigate();

    return (

        <Box
            sx={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
            }}
        >

            <BlockIcon
                color="error"
                sx={{
                    fontSize: 80,
                    mb: 2,
                }}
            />

            <Typography
                variant="h3"
                gutterBottom
            >
                403
            </Typography>

            <Typography
                variant="h5"
                gutterBottom
            >
                Access Denied
            </Typography>

            <Typography
                color="text.secondary"
                mb={4}
            >
                You don't have permission to access this page.
            </Typography>

            <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
            >
                Back to Dashboard
            </Button>

        </Box>

    );

};

export default Forbidden;