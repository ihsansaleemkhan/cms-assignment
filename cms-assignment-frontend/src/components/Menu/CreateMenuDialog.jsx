import { useEffect, useState } from "react";

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
import Add from "@mui/icons-material/Add";

import { toast } from "react-toastify";

import MenuForm from "./MenuForm";

import {
    createMenu,
    getAllMenus,
} from "../../services/menuService";

const CreateMenuDialog = ({
    open,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [menus, setMenus] = useState([]);

    useEffect(() => {
        if (open) {
            loadMenus();
        }
    }, [open]);

    const loadMenus = async () => {
        try {
            const menus = await getAllMenus();
            setMenus(menus);
        } catch {
            toast.error("Unable to load menu list.");
        }
    };

    const handleSubmit = async (data) => {
        try {
            setLoading(true);
            await createMenu(data);
            toast.success("Menu created successfully.");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message ??
                "Unable to create menu."
            );
        } finally {
            setLoading(false);
        }
    };

    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            keepMounted
            fullWidth
            maxWidth={false}
            disableEnforceFocus
            PaperProps={{
                sx: {
                    width: 600,
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
                                fontSize: 18,
                                fontWeight: 800,
                                color: "#fff",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            <Add sx={{ fontSize: 22 }} />
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
                                Create New Menu
                            </Typography>
                            <Typography
                                sx={{
                                    color: alpha("#fff", 0.7),
                                    fontSize: 12,
                                    fontWeight: 400,
                                    mt: 0.2,
                                }}
                            >
                                Add a new navigation item to your website
                            </Typography>
                        </Box>
                    </Stack>

                    {!loading && (
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
                    )}
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
                    <MenuForm
                        defaultValues={{}}
                        menus={menus}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />
                </Box>
            </DialogContent>

        </Dialog>

    );

};

export default CreateMenuDialog;