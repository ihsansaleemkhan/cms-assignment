import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Stack,
    Box,
    Typography,
    alpha,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";

import PageForm from "./PageForm";

const EditPageDialog = ({
    open,
    pageId,
    onClose,
    onSuccess,
}) => {

    const handleSubmit = async (formData) => {
        console.log(pageId, formData);
        // Update API will be connected next
        onClose();
        onSuccess?.();
    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={false}
            disableEnforceFocus
            PaperProps={{
                sx: {
                    width: 960,
                    maxWidth: "95vw",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                    border: "1px solid",
                    borderColor: "divider",
                },
            }}
            sx={{
                "& .MuiBackdrop-root": {
                    bgcolor: "rgba(15,23,42,0.45)",
                    backdropFilter: "blur(4px)",
                },
            }}
        >

            {/* ── Header ── */}
            <DialogTitle
                sx={{
                    m: 0,
                    p: 0,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        bgcolor: "primary.main",
                        px: 3.5,
                        py: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                bgcolor: alpha("#fff", 0.18),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <EditNoteIcon sx={{ fontSize: 20, color: "#fff" }} />
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: "#fff",
                                    fontSize: 18,
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                    letterSpacing: -0.2,
                                }}
                            >
                                Edit Page
                            </Typography>
                            <Typography
                                sx={{
                                    color: alpha("#fff", 0.7),
                                    fontSize: 12,
                                    fontWeight: 400,
                                    mt: 0.2,
                                }}
                            >
                                Modify the page details and content
                            </Typography>
                        </Box>
                    </Stack>

                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            color: alpha("#fff", 0.8),
                            "&:hover": {
                                bgcolor: alpha("#fff", 0.15),
                                color: "#fff",
                            },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            {/* ── Body ── */}
            <DialogContent
                sx={{
                    p: 0,
                    bgcolor: "#f8f9fc",
                }}
            >
                <Box sx={{ p: 3.5 }}>
                    <PageForm
                        loading={false}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />
                </Box>
            </DialogContent>

        </Dialog>

    );

};

export default EditPageDialog;