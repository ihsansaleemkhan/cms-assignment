import { useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Stack,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { toast } from "react-toastify";

import { deleteMenu } from "../../services/menuService";

const DeleteMenuDialog = ({
    open,
    menuId,
    menuTitle,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {

        try {

            setLoading(true);

            await deleteMenu(menuId);

            toast.success("Menu deleted successfully.");

            onSuccess();

            onClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to delete menu."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>
                Delete Menu
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    alignItems="center"
                    sx={{ py: 2 }}
                >

                    <WarningAmberIcon
                        color="warning"
                        sx={{ fontSize: 60 }}
                    />

                    <Typography align="center">

                        Are you sure you want to delete

                        <br />

                        <strong>{menuTitle}</strong> ?

                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    >
                        This action cannot be undone.
                    </Typography>

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading
                        ? <CircularProgress size={20} color="inherit" />
                        : "Delete"}
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteMenuDialog;