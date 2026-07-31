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
import EditIcon from "@mui/icons-material/Edit";

import { toast } from "react-toastify";

import UserForm from "./UserForm";

import {
    getUser,
    updateUser,
} from "../../services/userService";

const EditUserDialog = ({
    open,
    userId,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({});

    useEffect(() => {

        if (open && userId) {

            loadUser();

        }

    }, [open, userId]);

    const loadUser = async () => {

        try {

            setLoading(true);

            const response = await getUser(userId);

            setInitialValues(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load user."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleSubmit = async (payload) => {

        try {

            setLoading(true);

            await updateUser(
                userId,
                payload
            );

            toast.success(
                "User updated successfully."
            );

            onClose();

            onSuccess?.();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to update user."
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
                    width: 900,
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
                    bgcolor: "rgba(15,23,42,.45)",
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
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                bgcolor: alpha("#fff", .18),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <EditIcon
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
                                Edit User
                            </Typography>

                            <Typography
                                sx={{
                                    color: alpha("#fff", .75),
                                    fontSize: 13,
                                }}
                            >
                                Update user information
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

                <UserForm
                    initialValues={initialValues}
                    loading={loading}
                    isEdit={true}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />

            </DialogContent>

        </Dialog>

    );

};

export default EditUserDialog;