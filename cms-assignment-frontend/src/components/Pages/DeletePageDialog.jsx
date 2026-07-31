import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

const DeletePageDialog = ({
    open,
    pageTitle,
    onClose,
    onSuccess,
}) => {

    const handleDelete = async () => {

        console.log("Delete");

        // Delete API next

        onClose();

        if (onSuccess) {
            onSuccess();
        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
        >

            <DialogTitle>
                Delete Page
            </DialogTitle>

            <DialogContent>

                <Typography>

                    Are you sure you want to delete

                    <strong> {pageTitle}</strong> ?

                </Typography>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeletePageDialog;