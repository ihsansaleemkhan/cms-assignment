import { useEffect, useState } from "react";

import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { getRoles } from "../../services/userService";

const UserForm = ({
    initialValues = {},
    loading = false,
    isEdit = false,
    onSubmit,
    onCancel,
}) => {

    const [roles, setRoles] = useState([]);

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [role, setRole] = useState("");

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadRoles();
    }, []);

    useEffect(() => {

        if (initialValues && Object.keys(initialValues).length) {

            setName(initialValues.name || "");

            setEmail(initialValues.email || "");

            setRole(
                initialValues.roles?.length
                    ? initialValues.roles[0]
                    : ""
            );

        }

    }, [initialValues]);

    const loadRoles = async () => {

        try {

            const roles = await getRoles();

            setRoles(roles);

        } catch (error) {

            console.log(error);

        }

    };

    const validate = () => {

        const temp = {};

        if (!name.trim())
            temp.name = "Name is required.";

        if (!email.trim())
            temp.email = "Email is required.";

        if (!role)
            temp.role = "Role is required.";

        if (!isEdit) {

            if (!password)
                temp.password = "Password is required.";

            if (!confirmPassword)
                temp.confirmPassword = "Confirm Password is required.";

            if (
                password &&
                confirmPassword &&
                password !== confirmPassword
            ) {
                temp.confirmPassword = "Passwords do not match.";
            }

        }

        setErrors(temp);

        return Object.keys(temp).length === 0;

    };

    const handleSubmit = () => {

        if (!validate()) return;

        const payload = {
            name,
            email,
            role,
        };

        if (!isEdit) {

            payload.password = password;
            payload.password_confirmation = confirmPassword;

        }

        onSubmit(payload);

    };

    return (

        <Paper
            elevation={0}
            sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
            }}
        >

            <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
            >
                User Information
            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>

                    <TextField
                        fullWidth
                        label="Full Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <TextField
                        fullWidth
                        label="Email Address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <FormControl
                        fullWidth
                        error={!!errors.role}
                    >

                        <InputLabel>
                            Role
                        </InputLabel>

                        <Select
                            value={role}
                            label="Role"
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        >

                            {roles.map((item) => (

                                <MenuItem
                                    key={item.id}
                                    value={item.name}
                                >
                                    {item.name}
                                </MenuItem>

                            ))}

                        </Select>

                        <FormHelperText>

                            {errors.role}

                        </FormHelperText>

                    </FormControl>

                </Grid>

                {!isEdit && (

                    <>
                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                error={!!errors.password}
                                helperText={errors.password}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />

                        </Grid>
                    </>
                )}

                <Grid item xs={12}>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            variant="outlined"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={handleSubmit}
                        >
                            {isEdit
                                ? "Update User"
                                : "Create User"}
                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default UserForm;