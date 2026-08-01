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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { toast } from "react-toastify";

import {
    forceDeletePage,
} from "../../services/pageService";

import {
    forceDeleteMenu,
} from "../../services/menuService";

const ForceDeleteConfirmDialog = ({
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

    const handleForceDelete = async () => {

        if (!item?.id || !type) {
            return;
        }

        try {

            setLoading(true);

            if (isPage) {

                await forceDeletePage(item.id);

            } else {

                await forceDeleteMenu(item.id);

            }

            toast.success(
                `${
                    isPage ? "Page" : "Menu"
                } permanently deleted successfully.`
            );

            if (onSuccess) {
                await onSuccess();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                `Unable to permanently delete ${itemLabel}.`
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
                        "0 24px 60px rgba(15,23,42,0.24)",
                    border: "1px solid",
                    borderColor: "divider",
                },
            }}
            sx={{
                "& .MuiBackdrop-root": {
                    bgcolor: "rgba(15,23,42,0.5)",
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
                        bgcolor: "error.main",
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

                            <DeleteForeverIcon
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
                                Permanently Delete {
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
                                This action cannot be undone
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
                    severity="error"
                    icon={<WarningAmberIcon />}
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        alignItems: "center",
                    }}
                >
                    This will permanently remove the {itemLabel} from
                    the database. It cannot be restored afterwards.
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
                                bgcolor: alpha("#d32f2f", 0.08),
                                color: "error.main",
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
                                You are permanently deleting
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

                {!isPage && (

                    <Alert
                        severity="warning"
                        sx={{
                            mt: 2.5,
                            borderRadius: 2,
                            alignItems: "center",
                        }}
                    >
                        A menu cannot be permanently deleted while it
                        still has related pages or child menus.
                    </Alert>

                )}

                {isPage && item?.cover_image && (

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 2,
                            color: "text.secondary",
                        }}
                    >
                        The page cover image will also be removed from
                        storage.
                    </Typography>

                )}

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
                    color="error"
                    startIcon={<DeleteForeverIcon />}
                    onClick={handleForceDelete}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        boxShadow:
                            "0 2px 8px rgba(211,47,47,0.3)",

                        "&:hover": {
                            boxShadow:
                                "0 4px 14px rgba(211,47,47,0.4)",
                        },
                    }}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete Permanently"}
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default ForceDeleteConfirmDialog;