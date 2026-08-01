import {
    useEffect,
    useState,
} from "react";

import {
    Box,
} from "@mui/material";

import {
    Outlet,
    useLocation,
} from "react-router-dom";

import { toast } from "react-toastify";

import PublicHeader from "../components/Public/PublicHeader";
import PublicFooter from "../components/Public/PublicFooter";
import MobileNavigation from "../components/Public/MobileNavigation";
import LoadingPage from "../components/Public/LoadingPage";

import {
    getPublicMenus,
} from "../services/publicService";

const PublicLayout = () => {

    const location = useLocation();

    const [menus, setMenus] = useState([]);

    const [loading, setLoading] = useState(true);

    const [mobileOpen, setMobileOpen] = useState(false);

    const loadMenus = async () => {

        try {

            setLoading(true);

            const response = await getPublicMenus();

            setMenus(response.data ?? []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load website navigation."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadMenus();

    }, []);

    useEffect(() => {

        setMobileOpen(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    }, [location.pathname]);

    if (loading) {
        return <LoadingPage />;
    }

    return (

        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f7f8fb",
                color: "#14213d",
                display: "flex",
                flexDirection: "column",
            }}
        >

            <PublicHeader
                menus={menus}
                onMenuOpen={() =>
                    setMobileOpen(true)
                }
            />

            <MobileNavigation
                open={mobileOpen}
                menus={menus}
                onClose={() =>
                    setMobileOpen(false)
                }
            />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    pt: {
                        xs: 8,
                        md: 9,
                    },
                }}
            >

                <Outlet
                    context={{
                        menus,
                    }}
                />

            </Box>

            <PublicFooter
                menus={menus}
            />

        </Box>

    );

};

export default PublicLayout;