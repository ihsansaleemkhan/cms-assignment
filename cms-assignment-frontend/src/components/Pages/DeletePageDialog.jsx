import { useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Alert,
} from "@mui/material";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { toast } from "react-toastify";

import { deletePage } from "../../services/pageService";

const DeletePageDialog = ({
    open,
    page,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {

        if (!page) return;

        try {

            setLoading(true);

            await deletePage(page.id);

            toast.success("Page deleted successfully.");

            onClose();

            onSuccess?.();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to delete page."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle
                sx={{
                    bgcolor: "error.main",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 700,
                }}
            >
                <DeleteForeverIcon />
                Delete Page
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>

                <Alert severity="warning" sx={{ mb: 3 }}>
                    This action cannot be undone.
                </Alert>

                <Typography variant="body1">

                    Are you sure you want to delete

                    <strong> "{page?.title}" </strong>

                    ?

                </Typography>

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeletePageDialog;