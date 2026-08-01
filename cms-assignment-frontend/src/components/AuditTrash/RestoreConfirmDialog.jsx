import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
    alpha,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import RestoreIcon from "@mui/icons-material/Restore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

import { toast } from "react-toastify";

import {
    restorePage,
} from "../../services/pageService";

import {
    restoreMenu,
} from "../../services/menuService";

const RestoreConfirmDialog = ({
    open,
    item,
    type,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const isPage = type === "page";

    const itemLabel = isPage
        ? "page"
        : "menu";

    const handleRestore = async () => {

        if (!item?.id || !type) {
            return;
        }

        try {

            setLoading(true);

            if (isPage) {

                await restorePage(item.id);

            } else {

                await restoreMenu(item.id);

            }

            toast.success(
                `${
                    isPage ? "Page" : "Menu"
                } restored successfully.`
            );

            if (onSuccess) {
                await onSuccess();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                `Unable to restore ${itemLabel}.`
            );

        } finally {

            setLoading(false);

        }

    };

    const handleClose = () => {

        if (loading) {
            return;
        }

        onClose();
    };

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3.5,
                    overflow: "hidden",
                    boxShadow:
                        "0 24px 60px rgba(15,23,42,0.2)",
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

            {/* Header */}

            <DialogTitle
                sx={{
                    m: 0,
                    p: 0,
                }}
            >

                <Box
                    sx={{
                        bgcolor: "primary.main",
                        px: 3,
                        py: 2.25,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >

                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                bgcolor: alpha("#fff", 0.18),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <RestoreIcon
                                sx={{
                                    color: "#fff",
                                    fontSize: 21,
                                }}
                            />

                        </Box>

                        <Box>

                            <Typography
                                sx={{
                                    color: "#fff",
                                    fontSize: 18,
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                }}
                            >
                                Restore {
                                    isPage
                                        ? "Page"
                                        : "Menu"
                                }
                            </Typography>

                            <Typography
                                sx={{
                                    color: alpha("#fff", 0.72),
                                    fontSize: 12,
                                    mt: 0.25,
                                }}
                            >
                                Move this record back to the active list
                            </Typography>

                        </Box>

                    </Stack>

                    {!loading && (

                        <IconButton
                            onClick={handleClose}
                            size="small"
                            sx={{
                                color: alpha("#fff", 0.82),

                                "&:hover": {
                                    bgcolor: alpha("#fff", 0.14),
                                    color: "#fff",
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>

                    )}

                </Box>

            </DialogTitle>

            {/* Content */}

            <DialogContent
                sx={{
                    p: 3,
                    bgcolor: "#f8f9fc",
                }}
            >

                <Alert
                    severity="info"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        alignItems: "center",
                    }}
                >
                    Restoring this {itemLabel} will make it available
                    again in the normal management section.
                </Alert>

                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        bgcolor: "#fff",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.75}
                        alignItems="center"
                    >

                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                flexShrink: 0,
                                borderRadius: 2,
                                bgcolor: alpha("#1976d2", 0.08),
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            {isPage ? (

                                <DescriptionOutlinedIcon />

                            ) : (

                                <MenuBookOutlinedIcon />

                            )}

                        </Box>

                        <Box sx={{ minWidth: 0 }}>

                            <Typography
                                sx={{
                                    fontSize: 14,
                                    color: "text.secondary",
                                    mb: 0.35,
                                }}
                            >
                                You are restoring
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "text.primary",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {item?.title ?? "Selected record"}
                            </Typography>

                            {item?.slug && (

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "text.secondary",
                                        mt: 0.25,
                                    }}
                                >
                                    /{item.slug}
                                </Typography>

                            )}

                        </Box>

                    </Stack>

                </Box>

            </DialogContent>

            {/* Actions */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2.25,
                    bgcolor: "#fff",
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >

                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        color: "text.secondary",
                        borderColor: "#d1d5db",

                        "&:hover": {
                            borderColor: "#9aa0aa",
                            bgcolor: "#f9fafb",
                        },
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    startIcon={<RestoreIcon />}
                    onClick={handleRestore}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        boxShadow:
                            "0 2px 8px rgba(25,118,210,0.3)",

                        "&:hover": {
                            boxShadow:
                                "0 4px 14px rgba(25,118,210,0.4)",
                        },
                    }}
                >
                    {loading
                        ? "Restoring..."
                        : `Restore ${
                            isPage ? "Page" : "Menu"
                        }`}
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default RestoreConfirmDialog;