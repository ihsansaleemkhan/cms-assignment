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
import SecurityIcon from "@mui/icons-material/Security";

import { toast } from "react-toastify";

import RoleForm from "./RoleForm";

import {
    getRole,
    updateRole,
} from "../../services/roleService";

const EditRoleDialog = ({
    open,
    roleId,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {

        if (open && roleId) {

            loadRole();

        }

    }, [open, roleId]);

    const loadRole = async () => {

        try {

            setLoading(true);

            const response = await getRole(roleId);

            setInitialValues(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load role."
            );

            onClose();

        } finally {

            setLoading(false);

        }

    };

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            await updateRole(roleId, data);

            toast.success("Role updated successfully.");

            onClose();

            onSuccess?.();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to update role."
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
                },
            }}
        >

            <DialogTitle
                sx={{
                    p: 0,
                }}
            >

                <Box
                    sx={{
                        bgcolor: "primary.main",
                        px: 3,
                        py: 2.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >

                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: alpha("#fff", .15),
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >

                            <SecurityIcon sx={{ color: "#fff" }} />

                        </Box>

                        <Box>

                            <Typography
                                color="white"
                                fontWeight={700}
                                fontSize={18}
                            >
                                Edit Role
                            </Typography>

                            <Typography
                                color="rgba(255,255,255,.75)"
                                fontSize={12}
                            >
                                Update role information and permissions
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
                    bgcolor: "#f8f9fc",
                    p: 3,
                }}
            >

                {initialValues && (

                    <RoleForm
                        initialValues={initialValues}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />

                )}

            </DialogContent>

        </Dialog>

    );

};

export default EditRoleDialog;