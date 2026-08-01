import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    IconButton,
    Stack,
    Box,
    Typography,
    alpha,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

import { toast } from "react-toastify";

import MenuForm from "./MenuForm";

import {
    getMenu,
    getAllMenus,
    updateMenu,
} from "../../services/menuService";

const EditMenuDialog = ({
    open,
    menuId,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [fetching, setFetching] = useState(false);

    const [menu, setMenu] = useState(null);

    const [menus, setMenus] = useState([]);

    useEffect(() => {
        if (!open || !menuId) return;
        loadData();
    }, [open, menuId]);

    const loadData = async () => {

        try {

            setFetching(true);

            const [menuResponse, allMenus] = await Promise.all([
                getMenu(menuId),
                getAllMenus(),
            ]);

            setMenu(menuResponse.data);

            // Prevent selecting itself as parent
            setMenus(
                allMenus.filter(
                    (item) => item.id !== menuId
                )
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load menu."
            );

        } finally {

            setFetching(false);

        }

    };

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            await updateMenu(menuId, data);

            toast.success("Menu updated successfully.");

            onSuccess();

            handleClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to update menu."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleClose = () => {

        setMenu(null);

        setMenus([]);

        onClose();

    };

    return (

        <Dialog
            open={open}
            onClose={loading || fetching ? undefined : handleClose}
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
                            }}
                        >
                            <EditIcon sx={{ fontSize: 20, color: "#fff" }} />
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
                                Edit Menu
                            </Typography>
                            <Typography
                                sx={{
                                    color: alpha("#fff", 0.7),
                                    fontSize: 12,
                                    fontWeight: 400,
                                    mt: 0.2,
                                }}
                            >
                                Modify the navigation item details
                            </Typography>
                        </Box>
                    </Stack>

                    {!loading && !fetching && (
                        <IconButton
                            onClick={handleClose}
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
                    {fetching ? (
                        
                        /* Polished Fetching State */
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                py: 6,
                                gap: 2,
                            }}
                        >
                            <CircularProgress 
                                size={32} 
                                sx={{ color: "primary.main" }} 
                            />
                            <Typography 
                                sx={{ 
                                    fontSize: 13.5, 
                                    color: "text.secondary",
                                    fontWeight: 500,
                                }}
                            >
                                Loading menu details...
                            </Typography>
                        </Box>

                    ) : (

                        <MenuForm
                            defaultValues={menu}
                            menus={menus}
                            loading={loading}
                            onSubmit={handleSubmit}
                            onCancel={handleClose}
                        />

                    )}
                </Box>
            </DialogContent>

        </Dialog>

    );

};

export default EditMenuDialog;