import { useState } from "react";

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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import { toast } from "react-toastify";

import UserForm from "./UserForm";

import { createUser } from "../../services/userService";

const CreateUserDialog = ({
    open,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (payload) => {

        try {

            setLoading(true);

            await createUser(payload);

            toast.success("User created successfully.");

            onClose();

            onSuccess?.();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to create user."
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
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                bgcolor: alpha("#fff", 0.18),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <PersonAddAlt1Icon
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

                                Create User

                            </Typography>

                            <Typography
                                sx={{
                                    color: alpha("#fff", 0.75),
                                    fontSize: 13,
                                }}
                            >

                                Add a new CMS user

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
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />

            </DialogContent>

        </Dialog>

    );

};

export default CreateUserDialog;