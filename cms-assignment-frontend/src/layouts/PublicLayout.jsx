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

import {
    LanguageProvider,
    useLanguage,
} from "../context/LanguageContext";

const PublicLayoutContent = () => {

    const location = useLocation();

    const {
        language,
        isArabic,
        direction,
        toggleLanguage,
    } = useLanguage();

    const [menus, setMenus] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);

    const loadMenus = async () => {

        try {

            setLoading(true);

            const response =
                await getPublicMenus();

            setMenus(
                response.data ?? []
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                (
                    isArabic
                        ? "تعذر تحميل قائمة الموقع."
                        : "Unable to load website navigation."
                )
            );

            setMenus([]);

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

        return (
            <LoadingPage />
        );

    }

    return (

        <Box
            dir={direction}
            sx={{
                minHeight: "100vh",
                bgcolor: "#f7f8fb",
                color: "#14213d",
                display: "flex",
                flexDirection: "column",

                fontFamily: isArabic
                    ? "'Noto Sans Arabic', 'Tahoma', Arial, sans-serif"
                    : "inherit",
            }}
        >

            <PublicHeader
                menus={menus}
                language={language}
                isArabic={isArabic}
                onLanguageToggle={
                    toggleLanguage
                }
                onMenuOpen={() =>
                    setMobileOpen(true)
                }
            />

            <MobileNavigation
                open={mobileOpen}
                menus={menus}
                language={language}
                isArabic={isArabic}
                onLanguageToggle={
                    toggleLanguage
                }
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

                    textAlign: isArabic
                        ? "right"
                        : "left",
                }}
            >

                <Outlet
                    context={{
                        menus,
                        language,
                        isArabic,
                        direction,
                        toggleLanguage,
                    }}
                />

            </Box>

            <PublicFooter
                menus={menus}
                language={language}
                isArabic={isArabic}
            />

        </Box>

    );

};

const PublicLayout = () => {

    return (

        <LanguageProvider>

            <PublicLayoutContent />

        </LanguageProvider>

    );

};

export default PublicLayout;