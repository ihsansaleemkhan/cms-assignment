import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Stack,
} from "@mui/material";

import { toast } from "react-toastify";

import {
    deleteRole,
} from "../../services/roleService";

const DeleteRoleDialog = ({
    open,
    role,
    onClose,
    onSuccess,
}) => {

    const handleDelete = async () => {

        try {

            await deleteRole(role.id);

            toast.success(
                "Role deleted successfully."
            );

            onClose();

            onSuccess?.();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to delete role."
            );

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>

                Delete Role

            </DialogTitle>

            <DialogContent>

                <Stack spacing={2}>

                    <Typography>

                        Are you sure you want to delete the following role?

                    </Typography>

                    <Typography
                        variant="h6"
                        color="error"
                        fontWeight={700}
                    >

                        {role?.name}

                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        This action cannot be undone.

                    </Typography>

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteRoleDialog;