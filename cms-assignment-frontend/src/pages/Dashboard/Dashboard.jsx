import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Skeleton,
    Stack,
    Paper,
    alpha,
    Divider,
} from "@mui/material";

import {
    CalendarToday,
    TrendingUp,
} from "@mui/icons-material";

import { toast } from "react-toastify";
import dayjs from "dayjs";

import { getDashboard } from "../../services/dashboardService";

import StatisticsCards from "../../components/Dashboard/StatisticsCards";
import DashboardChart from "../../components/Dashboard/DashboardChart";
import LatestActivity from "../../components/Dashboard/LatestActivity";

const Dashboard = () => {

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState(null);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const response = await getDashboard();

            setDashboard(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadDashboard();

    }, []);

    // ── Skeleton Loader ──
    if (loading) {

        return (

            <Box>

                {/* Header Skeleton */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    mb={4}
                >
                    <Box>
                        <Skeleton width={180} height={32} sx={{ mb: 0.5 }} />
                        <Skeleton width={280} height={16} />
                    </Box>
                    <Skeleton width={140} height={36} sx={{ borderRadius: 2 }} />
                </Stack>

                {/* Stats Cards Skeleton */}
                <Stack
                    direction="row"
                    spacing={2.5}
                    sx={{ mb: 4 }}
                >
                    {[1, 2, 3, 4].map((i) => (
                        <Paper
                            key={i}
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 2.5,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "#eee",
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Skeleton width={80} height={14} />
                                <Skeleton
                                    width={36}
                                    height={36}
                                    sx={{ borderRadius: 2 }}
                                />
                            </Stack>
                            <Skeleton width={60} height={28} sx={{ mb: 0.5 }} />
                            <Skeleton width={100} height={12} />
                        </Paper>
                    ))}
                </Stack>

                {/* Chart Skeleton */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "#eee",
                        mb: 4,
                    }}
                >
                    <Skeleton width={160} height={20} sx={{ mb: 3 }} />
                    <Skeleton width="100%" height={320} sx={{ borderRadius: 2 }} />
                </Paper>

                {/* Activity Skeleton */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "#eee",
                    }}
                >
                    <Skeleton width={160} height={20} sx={{ mb: 3 }} />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Box key={i} sx={{ mb: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Skeleton width={40} height={40} sx={{ borderRadius: "50%" }} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton width={`60%`} height={14} sx={{ mb: 0.5 }} />
                                    <Skeleton width="40%" height={12} />
                                </Box>
                                <Skeleton width={70} height={12} />
                            </Stack>
                            {i < 5 && <Divider sx={{ mt: 2, borderColor: "#f5f5f5" }} />}
                        </Box>
                    ))}
                </Paper>

            </Box>

        );

    }

    return (

        <Box>

            {/* ── Page Header ── */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ mb: 4 }}
            >
                <Box>
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
                            Dashboard
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
                        Welcome back! Here's what's happening with your website today.
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        gap: 1,
                        px: 2.5,
                        py: 1.25,
                        borderRadius: 2.5,
                        border: "1px solid",
                        borderColor: "#e5e7eb",
                        bgcolor: "#fff",
                    }}
                >
                    <CalendarToday
                        sx={{ fontSize: 17, color: "text.secondary" }}
                    />
                    <Typography
                        sx={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "text.secondary",
                        }}
                    >
                        {dayjs().format("dddd, MMMM D, YYYY")}
                    </Typography>
                </Paper>
            </Stack>

            {/* ── Statistics Cards ── */}
            <StatisticsCards
                statistics={dashboard.statistics}
            />

            {/* ── Chart Section ── */}
            <Box sx={{ mt: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 4,
                            height: 20,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                        }}
                    />
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, fontSize: 15 }}
                    >
                        Page Analytics
                    </Typography>
                    <TrendingUp
                        sx={{ fontSize: 18, color: "primary.main", ml: 0.5 }}
                    />
                </Box>

                <DashboardChart
                    pageStatus={dashboard.page_status}
                />
            </Box>

            {/* ── Latest Activity ── */}
            <Box sx={{ mt: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 4,
                            height: 20,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                        }}
                    />
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, fontSize: 15 }}
                    >
                        Recent Activity
                    </Typography>
                </Box>

                <LatestActivity
                    latestPages={dashboard.latest_pages}
                    latestUsers={dashboard.latest_users}
                />
            </Box>

        </Box>

    );

};

export default Dashboard;