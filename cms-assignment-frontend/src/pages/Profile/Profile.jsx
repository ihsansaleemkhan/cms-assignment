import { useEffect, useMemo, useState } from "react";

import {
    Avatar,
    Box,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography,
    Skeleton,
    Paper,
    alpha,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";

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
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    // ── Skeleton Loader ──
    if (loading) {
        return (
            <Box>
                <Skeleton width={180} height={32} sx={{ mb: 1 }} />
                <Skeleton width={300} height={16} sx={{ mb: 4 }} />
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "#eee" }}>
                            <Stack spacing={2} alignItems="center">
                                <Skeleton variant="circular" width={90} height={90} />
                                <Skeleton width={120} height={24} />
                                <Skeleton width={160} height={16} />
                                <Skeleton width={80} height={28} sx={{ borderRadius: 2 }} />
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "#eee" }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} height={40} sx={{ borderRadius: 2, mb: 1 }} />
                                ))}
                            </Paper>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "#eee" }}>
                                <Skeleton width={140} height={20} sx={{ mb: 2 }} />
                                <Stack direction="row" spacing={1}>
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} width={70} height={28} sx={{ borderRadius: 2 }} />
                                    ))}
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const InfoRow = ({ icon: Icon, label, value }) => (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: 1.5,
                px: 2,
                borderRadius: 2,
                bgcolor: "#f8f9fc",
                transition: "all 0.2s",
                "&:hover": {
                    bgcolor: alpha("#1976d2", 0.04),
                },
            }}
        >
            <Icon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography
                variant="body2"
                sx={{
                    color: "text.secondary",
                    minWidth: 90,
                    fontWeight: 500,
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    color: "text.primary",
                }}
            >
                {value}
            </Typography>
        </Box>
    );

    return (

        <Box>

            {/* ── Page Header ── */}
            <Box sx={{ mb: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 4,
                            height: 26,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            fontSize: 26,
                            color: "text.primary",
                            letterSpacing: -0.5,
                        }}
                    >
                        My Profile
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: "text.secondary",
                        fontSize: 14,
                        ml: 1.25,
                    }}
                >
                    View your account details and assigned permissions.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                
                {/* ── Left Column: User Card ── */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "#fff",
                            textAlign: "center",
                        }}
                    >
                        <Stack spacing={2.5} alignItems="center">
                            <Avatar
                                sx={{
                                    width: 96,
                                    height: 96,
                                    fontSize: 36,
                                    fontWeight: 700,
                                    bgcolor: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                    color: "#fff",
                                    boxShadow: "0 6px 20px rgba(25,118,210,0.3)",
                                    border: "3px solid #fff",
                                    outline: "1px solid rgba(25,118,210,0.1)",
                                }}
                            >
                                {getInitials(profile.name)}
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: 20,
                                        color: "text.primary",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {profile.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        mt: 0.5,
                                        fontSize: 13.5,
                                    }}
                                >
                                    {profile.email}
                                </Typography>
                            </Box>

                            <Chip
                                label={profile.roles?.[0] || "User"}
                                sx={{
                                    height: 28,
                                    px: 2,
                                    fontWeight: 700,
                                    fontSize: 13,
                                    bgcolor: alpha("#1976d2", 0.1),
                                    color: "primary.main",
                                }}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                {/* ── Right Column: Info & Permissions ── */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        
                        {/* Account Information */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "#fff",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 16,
                                    mb: 2,
                                    color: "text.primary",
                                }}
                            >
                                Account Information
                            </Typography>

                            <Stack spacing={1.5}>
                                <InfoRow
                                    icon={PersonIcon}
                                    label="Full Name"
                                    value={profile.name}
                                />
                                <InfoRow
                                    icon={EmailIcon}
                                    label="Email"
                                    value={profile.email}
                                />
                                <InfoRow
                                    icon={AdminPanelSettingsIcon}
                                    label="Role"
                                    value={profile.roles?.join(", ")}
                                />
                                <InfoRow
                                    icon={VerifiedUserIcon}
                                    label="Created"
                                    value={new Date(profile.created_at).toLocaleString()}
                                />
                            </Stack>
                        </Paper>

                        {/* Permissions */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "#fff",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 2.5,
                                }}
                            >
                                <KeyIcon
                                    sx={{ fontSize: 20, color: "primary.main" }}
                                />
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: 16,
                                        color: "text.primary",
                                    }}
                                >
                                    Permissions
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                {Object.entries(groupedPermissions).map(
                                    ([module, actions]) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            key={module}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    mb: 1.5,
                                                    textTransform: "capitalize",
                                                    fontSize: 13.5,
                                                    color: "text.primary",
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
                                                {actions.map((action) => (
                                                    <Chip
                                                        key={action}
                                                        size="small"
                                                        label={action}
                                                        sx={{
                                                            height: 26,
                                                            fontWeight: 600,
                                                            fontSize: 12,
                                                            bgcolor: alpha("#2e7d32", 0.08),
                                                            color: "#2e7d32",
                                                            border: "1px solid",
                                                            borderColor: alpha("#2e7d32", 0.15),
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        </Grid>
                                    )
                                )}
                            </Grid>
                        </Paper>

                    </Stack>
                </Grid>

            </Grid>
        </Box>

    );

};

export default Profile;