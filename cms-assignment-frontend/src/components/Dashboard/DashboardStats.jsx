import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Skeleton,
} from "@mui/material";

import { toast } from "react-toastify";

import { getDashboard } from "../../services/dashboardService";

import DashboardStats from "../../components/Dashboard/StatisticsCards";
import DashboardChart from "../../components/Dashboard/DashboardChart";
import LatestActivity from "../../components/Dashboard/LatestActivity";

const Dashboard = () => {

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({
        statistics: {
            menus: 0,
            pages: 0,
            users: 0,
            roles: 0,
        },
        page_status: {
            published: 0,
            draft: 0,
        },
        latest_pages: [],
        latest_users: [],
    });

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const response = await getDashboard();

            /*
             * Expected API response:
             *
             * {
             *   data:{
             *      statistics:{},
             *      page_status:{},
             *      latest_pages:[],
             *      latest_users:[]
             *   }
             * }
             */

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

    if (loading) {

        return (

            <Box>

                <Skeleton
                    variant="rounded"
                    height={120}
                    sx={{ mb: 3 }}
                />

                <Skeleton
                    variant="rounded"
                    height={350}
                    sx={{ mb: 3 }}
                />

                <Skeleton
                    variant="rounded"
                    height={350}
                />

            </Box>

        );

    }

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight={700}
                mb={3}
            >
                Dashboard
            </Typography>

            {/* Statistics */}

            <DashboardStats
                statistics={dashboard.statistics}
            />

            {/* Pie Chart */}

            <Box mt={4}>

                <DashboardChart
                    pageStatus={dashboard.page_status}
                />

            </Box>

            {/* Latest Pages & Users */}

            <Box mt={4}>

                <LatestActivity
                    latestPages={dashboard.latest_pages}
                    latestUsers={dashboard.latest_users}
                />

            </Box>

        </Box>

    );

};

export default Dashboard;