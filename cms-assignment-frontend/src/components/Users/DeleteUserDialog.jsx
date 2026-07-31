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

import { deleteUser } from "../../services/userService";

const DeleteUserDialog = ({
    open,
    user,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {

        if (!user) return;

        try {

            setLoading(true);

            await deleteUser(user.id);

            toast.success("User deleted successfully.");

            onClose();

            onSuccess?.();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to delete user."
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

                Delete User

            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>

                <Alert
                    severity="warning"
                    sx={{ mb: 3 }}
                >
                    This action cannot be undone.
                </Alert>

                <Typography>

                    Are you sure you want to delete

                    <strong> "{user?.name}" </strong>

                    ?

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={2}
                >

                    Email: {user?.email}

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
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete User"}
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteUserDialog;