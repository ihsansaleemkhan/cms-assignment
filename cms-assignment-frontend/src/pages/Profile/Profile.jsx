import { useEffect, useMemo, useState } from "react";

import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import { toast } from "react-toastify";

import { getProfile } from "../../services/profileService";

const Profile = () => {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const loadProfile = async () => {

        try {

            setLoading(true);

            const data = await getProfile();

            setProfile(data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load profile."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadProfile();

    }, []);

    const groupedPermissions = useMemo(() => {

        if (!profile?.permissions) return {};

        return profile.permissions.reduce((acc, permission) => {

            const [module, action] = permission.split(".");

            if (!acc[module]) {

                acc[module] = [];

            }

            acc[module].push(action);

            return acc;

        }, {});

    }, [profile]);

    const getInitials = (name) => {

        if (!name) return "?";

        const parts = name.trim().split(" ");

        if (parts.length > 1) {

            return (
                parts[0][0] +
                parts[parts.length - 1][0]
            ).toUpperCase();

        }

        return name[0].toUpperCase();

    };

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={10}
            >

                <CircularProgress />

            </Box>

        );

    }

    return (

        <Box>

            <Typography
                variant="h4"
                mb={3}
                fontWeight={700}
            >
                My Profile
            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={4}>

                    <Card>

                        <CardContent>

                            <Stack
                                spacing={2}
                                alignItems="center"
                            >

                                <Avatar
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        fontSize: 34,
                                    }}
                                >
                                    {getInitials(profile.name)}
                                </Avatar>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    {profile.name}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    {profile.email}
                                </Typography>

                                <Chip
                                    color="primary"
                                    label={profile.roles?.[0]}
                                />

                            </Stack>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid item xs={12} md={8}>

                    <Card>

                        <CardContent>

                            <Stack spacing={2}>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Account Information
                                </Typography>

                                <Divider />

                                <Stack direction="row">

                                    <PersonIcon
                                        sx={{ mr: 1 }}
                                    />

                                    <Typography>
                                        <strong>Name:</strong>{" "}
                                        {profile.name}
                                    </Typography>

                                </Stack>

                                <Stack direction="row">

                                    <PersonIcon
                                        sx={{ mr: 1 }}
                                    />

                                    <Typography>
                                        <strong>Email:</strong>{" "}
                                        {profile.email}
                                    </Typography>

                                </Stack>

                                <Stack direction="row">

                                    <AdminPanelSettingsIcon
                                        sx={{ mr: 1 }}
                                    />

                                    <Typography>
                                        <strong>Role:</strong>{" "}
                                        {profile.roles?.join(", ")}
                                    </Typography>

                                </Stack>

                                <Stack direction="row">

                                    <VerifiedUserIcon
                                        sx={{ mr: 1 }}
                                    />

                                    <Typography>
                                        <strong>Created:</strong>{" "}
                                        {new Date(profile.created_at)
                                            .toLocaleString()}
                                    </Typography>

                                </Stack>

                            </Stack>

                        </CardContent>

                    </Card>

                    <Card sx={{ mt: 3 }}>

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={3}
                            >
                                Permissions
                            </Typography>

                            <Grid container spacing={3}>

                                {Object.entries(groupedPermissions).map(
                                    ([module, actions]) => (

                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            key={module}
                                        >

                                            <Typography
                                                fontWeight={700}
                                                mb={1}
                                                sx={{
                                                    textTransform:
                                                        "capitalize",
                                                }}
                                            >
                                                {module}
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                flexWrap="wrap"
                                                useFlexGap
                                            >

                                                {actions.map(action => (

                                                    <Chip
                                                        key={action}
                                                        size="small"
                                                        color="success"
                                                        label={action}
                                                    />

                                                ))}

                                            </Stack>

                                        </Grid>

                                    )
                                )}

                            </Grid>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Box>

    );

};

export default Profile;