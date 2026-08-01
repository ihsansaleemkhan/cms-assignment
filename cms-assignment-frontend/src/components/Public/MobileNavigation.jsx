import {
    Box,
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    alpha,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LanguageIcon from "@mui/icons-material/Language";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WebAssetIcon from "@mui/icons-material/WebAsset";

import {
    Link,
    useLocation,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import {
    getLocalizedTitle,
} from "../../utils/localization";

const MobileNavigation = ({
    open,
    menus = [],
    language = "en",
    isArabic = false,
    onLanguageToggle,
    onClose,
}) => {

    const location = useLocation();

    const [expandedMenus, setExpandedMenus] =
        useState({});

    useEffect(() => {

        if (!open) {
            setExpandedMenus({});
        }

    }, [open]);

    const toggleMenu = (menuId) => {

        setExpandedMenus((previous) => ({
            ...previous,
            [menuId]: !previous[menuId],
        }));

    };

    const isPathActive = (path) => {

        return location.pathname === path;

    };

    const hasMenuContent = (menu) => {

        return (
            menu.pages?.length > 0 ||
            menu.children?.length > 0
        );

    };

    const visibleMenus = menus.filter((menu) => {

        const isHomeMenu =
            menu.slug === "home" ||
            menu.slug === "home-page";

        if (isHomeMenu) {
            return false;
        }

        return (
            menu.pages?.length > 0 ||
            menu.children?.some(
                (child) =>
                    child.pages?.length > 0
            )
        );

    });

    const homeLabel =
        isArabic
            ? "الرئيسية"
            : "Home";

    const navigationLabel =
        isArabic
            ? "التنقل"
            : "Navigation";

    const viewAllLabel =
        isArabic
            ? "عرض الكل"
            : "View all";

    const languageTitle =
        isArabic
            ? "اللغة"
            : "Language";

    const languageDescription =
        isArabic
            ? "التبديل إلى اللغة الإنجليزية"
            : "Switch to Arabic";

    return (

        <Drawer
            anchor={
                isArabic
                    ? "left"
                    : "right"
            }
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true,
            }}
            PaperProps={{
                dir: isArabic
                    ? "rtl"
                    : "ltr",

                sx: {
                    width: {
                        xs: "88vw",
                        sm: 390,
                    },

                    maxWidth: 420,
                    bgcolor: "#fff",

                    borderLeft: isArabic
                        ? "none"
                        : "1px solid",

                    borderRight: isArabic
                        ? "1px solid"
                        : "none",

                    borderColor: "divider",

                    boxShadow: isArabic
                        ? "16px 0 48px rgba(15,23,42,0.16)"
                        : "-16px 0 48px rgba(15,23,42,0.16)",
                },
            }}
        >

            <Box
                sx={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: isArabic
                        ? "'Noto Sans Arabic', Tahoma, Arial, sans-serif"
                        : "inherit",
                }}
            >

                {/* Header */}

                <Box
                    sx={{
                        px: 2.5,
                        py: 2.25,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        bgcolor: "#f8f9fc",
                    }}
                >

                    <Stack
                        direction={
                            isArabic
                                ? "row-reverse"
                                : "row"
                        }
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >

                        <Stack
                            direction={
                                isArabic
                                    ? "row-reverse"
                                    : "row"
                            }
                            alignItems="center"
                            spacing={1.25}
                            sx={{
                                minWidth: 0,
                            }}
                        >

                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 2.25,
                                    background:
                                        "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        "0 8px 20px rgba(25,118,210,0.24)",
                                    flexShrink: 0,
                                }}
                            >
                                <WebAssetIcon
                                    sx={{
                                        fontSize: 22,
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    minWidth: 0,
                                    textAlign: isArabic
                                        ? "right"
                                        : "left",
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        fontWeight: 900,
                                        color: "#10233f",
                                        lineHeight: 1.1,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    Ihsan Saleemkhan
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.25,
                                        fontSize: 9.5,
                                        fontWeight: 800,
                                        color: "primary.main",
                                        letterSpacing: isArabic
                                            ? 0
                                            : 1.7,
                                        textTransform: isArabic
                                            ? "none"
                                            : "uppercase",
                                    }}
                                >
                                    {isArabic
                                        ? "تجربة رقمية"
                                        : "Digital Experience"}
                                </Typography>

                            </Box>

                        </Stack>

                        <IconButton
                            onClick={onClose}
                            size="small"
                            aria-label={
                                isArabic
                                    ? "إغلاق القائمة"
                                    : "Close navigation"
                            }
                            sx={{
                                bgcolor:
                                    alpha(
                                        "#14213d",
                                        0.05
                                    ),
                                color: "#10233f",

                                "&:hover": {
                                    bgcolor:
                                        alpha(
                                            "#14213d",
                                            0.1
                                        ),
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                    </Stack>

                </Box>

                {/* Navigation */}

                <Box
                    sx={{
                        px: 1.5,
                        py: 2,
                        flex: 1,
                        overflowY: "auto",
                    }}
                >

                    <Typography
                        sx={{
                            px: 1.5,
                            mb: 1,
                            fontSize: 10.5,
                            fontWeight: 800,
                            color: "text.disabled",
                            letterSpacing: isArabic
                                ? 0
                                : 1.6,
                            textTransform: isArabic
                                ? "none"
                                : "uppercase",
                            textAlign: isArabic
                                ? "right"
                                : "left",
                        }}
                    >
                        {navigationLabel}
                    </Typography>

                    <List disablePadding>

                        {/* Home */}

                        <ListItemButton
                            component={Link}
                            to="/"
                            onClick={onClose}
                            sx={{
                                mb: 0.5,
                                px: 1.5,
                                py: 1.15,
                                borderRadius: 2,
                                color: isPathActive("/")
                                    ? "primary.main"
                                    : "text.secondary",
                                bgcolor: isPathActive("/")
                                    ? alpha(
                                        "#1976d2",
                                        0.08
                                    )
                                    : "transparent",

                                "&:hover": {
                                    bgcolor:
                                        alpha(
                                            "#1976d2",
                                            0.06
                                        ),
                                    color: "primary.main",
                                },
                            }}
                        >

                            <ListItemIcon
                                sx={{
                                    minWidth: 38,
                                    color: "inherit",
                                }}
                            >
                                <HomeOutlinedIcon />
                            </ListItemIcon>

                            <ListItemText
                                primary={homeLabel}
                                primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    textAlign: isArabic
                                        ? "right"
                                        : "left",
                                }}
                            />

                        </ListItemButton>

                        {/* Dynamic menus */}

                        {visibleMenus.map((menu) => {

                            const expanded =
                                Boolean(
                                    expandedMenus[menu.id]
                                );

                            const menuActive =
                                isPathActive(
                                    `/menu/${menu.slug}`
                                ) ||
                                (menu.pages ?? []).some(
                                    (page) =>
                                        isPathActive(
                                            `/page/${page.slug}`
                                        )
                                ) ||
                                (menu.children ?? []).some(
                                    (child) =>
                                        isPathActive(
                                            `/menu/${child.slug}`
                                        ) ||
                                        (
                                            child.pages ?? []
                                        ).some(
                                            (page) =>
                                                isPathActive(
                                                    `/page/${page.slug}`
                                                )
                                        )
                                );

                            const expandable =
                                hasMenuContent(menu);

                            const menuTitle =
                                getLocalizedTitle(
                                    menu,
                                    language
                                );

                            return (

                                <Box key={menu.id}>

                                    <ListItemButton
                                        onClick={() => {

                                            if (expandable) {
                                                toggleMenu(
                                                    menu.id
                                                );

                                                return;
                                            }

                                            onClose();

                                        }}
                                        component={
                                            expandable
                                                ? "button"
                                                : Link
                                        }
                                        to={
                                            expandable
                                                ? undefined
                                                : `/menu/${menu.slug}`
                                        }
                                        sx={{
                                            mb: 0.5,
                                            px: 1.5,
                                            py: 1.15,
                                            borderRadius: 2,
                                            color: menuActive
                                                ? "primary.main"
                                                : "text.secondary",
                                            bgcolor: menuActive
                                                ? alpha(
                                                    "#1976d2",
                                                    0.08
                                                )
                                                : "transparent",

                                            "&:hover": {
                                                bgcolor:
                                                    alpha(
                                                        "#1976d2",
                                                        0.06
                                                    ),
                                                color:
                                                    "primary.main",
                                            },
                                        }}
                                    >

                                        <ListItemIcon
                                            sx={{
                                                minWidth: 38,
                                                color: "inherit",
                                            }}
                                        >
                                            <MenuBookOutlinedIcon />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={menuTitle}
                                            primaryTypographyProps={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                textAlign: isArabic
                                                    ? "right"
                                                    : "left",
                                            }}
                                        />

                                        {expandable && (

                                            expanded ? (

                                                <KeyboardArrowDownIcon />

                                            ) : isArabic ? (

                                                <KeyboardArrowLeftIcon />

                                            ) : (

                                                <KeyboardArrowRightIcon />

                                            )

                                        )}

                                    </ListItemButton>

                                    {expandable && (

                                        <Collapse
                                            in={expanded}
                                            timeout="auto"
                                            unmountOnExit
                                        >

                                            <Box
                                                sx={{
                                                    ml: isArabic
                                                        ? 0
                                                        : 2,

                                                    mr: isArabic
                                                        ? 2
                                                        : 0,

                                                    pl: isArabic
                                                        ? 0
                                                        : 1.5,

                                                    pr: isArabic
                                                        ? 1.5
                                                        : 0,

                                                    mb: 1,

                                                    borderLeft: isArabic
                                                        ? "none"
                                                        : "1px solid",

                                                    borderRight: isArabic
                                                        ? "1px solid"
                                                        : "none",

                                                    borderColor:
                                                        alpha(
                                                            "#1976d2",
                                                            0.16
                                                        ),
                                                }}
                                            >

                                                {/* View all */}

                                                <ListItemButton
                                                    component={Link}
                                                    to={`/menu/${menu.slug}`}
                                                    onClick={onClose}
                                                    sx={{
                                                        py: 0.85,
                                                        px: 1.25,
                                                        borderRadius:
                                                            1.75,
                                                        color:
                                                            "primary.main",

                                                        "&:hover": {
                                                            bgcolor:
                                                                alpha(
                                                                    "#1976d2",
                                                                    0.06
                                                                ),
                                                        },
                                                    }}
                                                >

                                                    <ListItemText
                                                        primary={
                                                            isArabic
                                                                ? `${viewAllLabel} ${menuTitle}`
                                                                : `${viewAllLabel} ${menuTitle}`
                                                        }
                                                        primaryTypographyProps={{
                                                            fontSize: 13,
                                                            fontWeight: 800,
                                                            textAlign:
                                                                isArabic
                                                                    ? "right"
                                                                    : "left",
                                                        }}
                                                    />

                                                </ListItemButton>

                                                {/* Root pages */}

                                                {menu.pages?.map(
                                                    (page) => (

                                                        <ListItemButton
                                                            key={page.id}
                                                            component={Link}
                                                            to={`/page/${page.slug}`}
                                                            onClick={onClose}
                                                            sx={{
                                                                py: 0.85,
                                                                px: 1.25,
                                                                borderRadius:
                                                                    1.75,
                                                                color:
                                                                    isPathActive(
                                                                        `/page/${page.slug}`
                                                                    )
                                                                        ? "primary.main"
                                                                        : "text.secondary",

                                                                bgcolor:
                                                                    isPathActive(
                                                                        `/page/${page.slug}`
                                                                    )
                                                                        ? alpha(
                                                                            "#1976d2",
                                                                            0.06
                                                                        )
                                                                        : "transparent",

                                                                "&:hover": {
                                                                    bgcolor:
                                                                        alpha(
                                                                            "#1976d2",
                                                                            0.05
                                                                        ),
                                                                    color:
                                                                        "primary.main",
                                                                },
                                                            }}
                                                        >

                                                            <ListItemIcon
                                                                sx={{
                                                                    minWidth:
                                                                        30,
                                                                    color:
                                                                        "inherit",
                                                                }}
                                                            >
                                                                <DescriptionOutlinedIcon
                                                                    sx={{
                                                                        fontSize:
                                                                            18,
                                                                    }}
                                                                />
                                                            </ListItemIcon>

                                                            <ListItemText
                                                                primary={
                                                                    getLocalizedTitle(
                                                                        page,
                                                                        language
                                                                    )
                                                                }
                                                                primaryTypographyProps={{
                                                                    fontSize:
                                                                        13,
                                                                    fontWeight:
                                                                        600,
                                                                    textAlign:
                                                                        isArabic
                                                                            ? "right"
                                                                            : "left",
                                                                }}
                                                            />

                                                        </ListItemButton>

                                                    )
                                                )}

                                                {/* Child menus */}

                                                {menu.children?.map(
                                                    (child) => {

                                                        const childTitle =
                                                            getLocalizedTitle(
                                                                child,
                                                                language
                                                            );

                                                        return (

                                                            <Box
                                                                key={
                                                                    child.id
                                                                }
                                                                sx={{
                                                                    mt: 0.5,
                                                                }}
                                                            >

                                                                <ListItemButton
                                                                    component={
                                                                        Link
                                                                    }
                                                                    to={`/menu/${child.slug}`}
                                                                    onClick={
                                                                        onClose
                                                                    }
                                                                    sx={{
                                                                        py: 0.8,
                                                                        px: 1.25,
                                                                        borderRadius:
                                                                            1.75,
                                                                        color:
                                                                            isPathActive(
                                                                                `/menu/${child.slug}`
                                                                            )
                                                                                ? "primary.main"
                                                                                : "text.primary",

                                                                        "&:hover":
                                                                            {
                                                                                bgcolor:
                                                                                    alpha(
                                                                                        "#1976d2",
                                                                                        0.05
                                                                                    ),
                                                                            },
                                                                    }}
                                                                >

                                                                    <ListItemText
                                                                        primary={
                                                                            childTitle
                                                                        }
                                                                        primaryTypographyProps={{
                                                                            fontSize:
                                                                                12.5,
                                                                            fontWeight:
                                                                                800,
                                                                            textAlign:
                                                                                isArabic
                                                                                    ? "right"
                                                                                    : "left",
                                                                        }}
                                                                    />

                                                                </ListItemButton>

                                                                {child.pages?.map(
                                                                    (
                                                                        page
                                                                    ) => (

                                                                        <ListItemButton
                                                                            key={
                                                                                page.id
                                                                            }
                                                                            component={
                                                                                Link
                                                                            }
                                                                            to={`/page/${page.slug}`}
                                                                            onClick={
                                                                                onClose
                                                                            }
                                                                            sx={{
                                                                                ml: isArabic
                                                                                    ? 0
                                                                                    : 1,

                                                                                mr: isArabic
                                                                                    ? 1
                                                                                    : 0,

                                                                                py: 0.75,
                                                                                px: 1.25,
                                                                                borderRadius:
                                                                                    1.75,
                                                                                color:
                                                                                    isPathActive(
                                                                                        `/page/${page.slug}`
                                                                                    )
                                                                                        ? "primary.main"
                                                                                        : "text.secondary",

                                                                                bgcolor:
                                                                                    isPathActive(
                                                                                        `/page/${page.slug}`
                                                                                    )
                                                                                        ? alpha(
                                                                                            "#1976d2",
                                                                                            0.05
                                                                                        )
                                                                                        : "transparent",

                                                                                "&:hover":
                                                                                    {
                                                                                        bgcolor:
                                                                                            alpha(
                                                                                                "#1976d2",
                                                                                                0.05
                                                                                            ),
                                                                                        color:
                                                                                            "primary.main",
                                                                                    },
                                                                            }}
                                                                        >

                                                                            <ListItemIcon
                                                                                sx={{
                                                                                    minWidth:
                                                                                        28,
                                                                                    color:
                                                                                        "inherit",
                                                                                }}
                                                                            >
                                                                                <DescriptionOutlinedIcon
                                                                                    sx={{
                                                                                        fontSize:
                                                                                            16,
                                                                                    }}
                                                                                />
                                                                            </ListItemIcon>

                                                                            <ListItemText
                                                                                primary={
                                                                                    getLocalizedTitle(
                                                                                        page,
                                                                                        language
                                                                                    )
                                                                                }
                                                                                primaryTypographyProps={{
                                                                                    fontSize:
                                                                                        12.5,
                                                                                    fontWeight:
                                                                                        600,
                                                                                    textAlign:
                                                                                        isArabic
                                                                                            ? "right"
                                                                                            : "left",
                                                                                }}
                                                                            />

                                                                        </ListItemButton>

                                                                    )
                                                                )}

                                                            </Box>

                                                        );

                                                    }
                                                )}

                                            </Box>

                                        </Collapse>

                                    )}

                                </Box>

                            );

                        })}

                    </List>

                </Box>

                {/* Language switch */}

                <Box
                    sx={{
                        p: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        bgcolor: "#fafbfc",
                    }}
                >

                    <ListItemButton
                        onClick={() => {

                            onLanguageToggle?.();

                            onClose?.();

                        }}
                        sx={{
                            borderRadius: 2,
                            px: 1.5,
                            py: 1,
                            border: "1px solid",
                            borderColor:
                                alpha(
                                    "#1976d2",
                                    0.12
                                ),

                            "&:hover": {
                                bgcolor:
                                    alpha(
                                        "#1976d2",
                                        0.06
                                    ),
                                borderColor:
                                    alpha(
                                        "#1976d2",
                                        0.3
                                    ),
                            },
                        }}
                    >

                        <ListItemIcon
                            sx={{
                                minWidth: 38,
                                color: "primary.main",
                            }}
                        >
                            <LanguageIcon />
                        </ListItemIcon>

                        <ListItemText
                            primary={languageTitle}
                            secondary={
                                languageDescription
                            }
                            primaryTypographyProps={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                textAlign: isArabic
                                    ? "right"
                                    : "left",
                            }}
                            secondaryTypographyProps={{
                                fontSize: 11,
                                textAlign: isArabic
                                    ? "right"
                                    : "left",
                            }}
                        />

                        <Typography
                            sx={{
                                ml: isArabic
                                    ? 0
                                    : 1,

                                mr: isArabic
                                    ? 1
                                    : 0,

                                px: 1.1,
                                py: 0.4,
                                borderRadius: 1.5,
                                bgcolor:
                                    alpha(
                                        "#1976d2",
                                        0.08
                                    ),
                                color: "primary.main",
                                fontSize: 11,
                                fontWeight: 800,
                            }}
                        >
                            {isArabic
                                ? "EN"
                                : "AR"}
                        </Typography>

                    </ListItemButton>

                </Box>

            </Box>

        </Drawer>

    );

};

export default MobileNavigation;