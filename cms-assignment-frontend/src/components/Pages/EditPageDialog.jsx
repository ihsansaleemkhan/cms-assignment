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
    CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { toast } from "react-toastify";

import PageForm from "./PageForm";

import {
    getPage,
    updatePage,
} from "../../services/pageService";

const EditPageDialog = ({
    open,
    pageId,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(null);

    const loadPage = async () => {

        if (!pageId) return;

        try {

            setLoading(true);

            const response = await getPage(pageId);

            setPage(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load page."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (open) {
            loadPage();
        }

    }, [open, pageId]);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            await updatePage(pageId, formData);

            toast.success("Page updated successfully.");

            onClose();

            onSuccess?.();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to update page."
            );

        } finally {

            setLoading(false);

        }

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
                    width: 1100,
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

            <DialogTitle
                sx={{
                    m: 0,
                    p: 0,
                }}
            >

                <Box
                    sx={{
                        bgcolor: "primary.main",
                        px: 3.5,
                        py: 2.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >

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

                            <EditNoteIcon
                                sx={{
                                    color: "#fff",
                                }}
                            />

                        </Box>

                        <Box>

                            <Typography
                                sx={{
                                    color: "#fff",
                                    fontSize: 20,
                                    fontWeight: 700,
                                }}
                            >

                                Edit Page

                            </Typography>

                            <Typography
                                sx={{
                                    color: alpha("#fff", 0.75),
                                    fontSize: 13,
                                }}
                            >

                                Update page details

                            </Typography>

                        </Box>

                    </Stack>

                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: "#fff",
                        }}
                    >

                        <CloseIcon />

                    </IconButton>

                </Box>

            </DialogTitle>

            <DialogContent
                sx={{
                    p: 3,
                    bgcolor: "#f8f9fc",
                }}
            >

                {loading && !page ? (

                    <Box
                        display="flex"
                        justifyContent="center"
                        py={10}
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <PageForm
                        initialValues={page}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />

                )}

            </DialogContent>

        </Dialog>

    );

};

export default EditPageDialog;