import { useEffect, useMemo, useState } from "react";

import {
    Paper,
    Grid,
    TextField,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    Stack,
    Divider,
    Button,
} from "@mui/material";

import {
    getPermissions,
} from "../../services/roleService";

const RoleForm = ({
    initialValues = {},
    loading = false,
    onSubmit,
    onCancel,
}) => {

    const [name, setName] = useState("");

    const [permissions, setPermissions] = useState([]);

    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [errors, setErrors] = useState({});

    useEffect(() => {

        loadPermissions();

    }, []);

    useEffect(() => {

        if (Object.keys(initialValues).length) {

            setName(initialValues.name || "");

            setSelectedPermissions(
                initialValues.permissions || []
            );

        }

    }, [initialValues]);

    const loadPermissions = async () => {

        try {

            const response = await getPermissions();

            setPermissions(response.data);

        } catch (e) {

            console.log(e);

        }

    };

    const groupedPermissions = useMemo(() => {

        const groups = {};

        permissions.forEach(permission => {

            const [module, action] = permission.name.split(".");

            if (!groups[module]) {

                groups[module] = [];

            }

            groups[module].push(permission.name);

        });

        return groups;

    }, [permissions]);

    const togglePermission = (permission) => {

        if (selectedPermissions.includes(permission)) {

            setSelectedPermissions(

                selectedPermissions.filter(
                    p => p !== permission
                )

            );

        } else {

            setSelectedPermissions([
                ...selectedPermissions,
                permission,
            ]);

        }

    };

    const validate = () => {

        const temp = {};

        if (!name.trim()) {

            temp.name = "Role name is required.";

        }

        if (selectedPermissions.length === 0) {

            temp.permissions = "Select at least one permission.";

        }

        setErrors(temp);

        return Object.keys(temp).length === 0;

    };

    const handleSubmit = () => {

        if (!validate()) return;

        onSubmit({

            name,

            permissions: selectedPermissions,

        });

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
                Role Information
            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        label="Role Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                </Grid>

                <Grid item xs={12}>

                    <Divider sx={{ mb: 2 }} />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Permissions
                    </Typography>

                    {errors.permissions && (

                        <Typography
                            color="error"
                            mb={2}
                        >
                            {errors.permissions}
                        </Typography>

                    )}

                    <Stack spacing={3}>

                        {Object.entries(groupedPermissions).map(

                            ([module, perms]) => (

                                <Box
                                    key={module}
                                >

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            textTransform: "capitalize",
                                            mb: 1,
                                        }}
                                    >
                                        {module}
                                    </Typography>

                                    <Grid
                                        container
                                        spacing={1}
                                    >

                                        {perms.map(permission => (

                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={3}
                                                key={permission}
                                            >

                                                <FormControlLabel

                                                    control={

                                                        <Checkbox

                                                            checked={selectedPermissions.includes(permission)}

                                                            onChange={() =>
                                                                togglePermission(permission)
                                                            }

                                                        />

                                                    }

                                                    label={
                                                        permission
                                                            .split(".")[1]
                                                            .replace(/^./, c => c.toUpperCase())
                                                    }

                                                />

                                            </Grid>

                                        ))}

                                    </Grid>

                                </Box>

                            )

                        )}

                    </Stack>

                </Grid>

                <Grid item xs={12}>

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
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
                            Save Role
                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default RoleForm;