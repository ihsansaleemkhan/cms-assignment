import { useMemo, useState } from "react";

import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography,
    alpha,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LanguageIcon from "@mui/icons-material/Language";
import WebAssetIcon from "@mui/icons-material/WebAsset";

import {
    Link,
    NavLink,
    useLocation,
} from "react-router-dom";

const PublicHeader = ({
    menus = [],
    onMenuOpen,
}) => {

    const location = useLocation();

    const [anchorEl, setAnchorEl] = useState(null);

    const [activeMenu, setActiveMenu] = useState(null);

    const dropdownOpen = Boolean(anchorEl);

    const visibleMenus = useMemo(
        () => menus.filter((menu) => {
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
        }),
        [menus]
    );

    const handleDropdownOpen = (
        event,
        menu
    ) => {
        setAnchorEl(event.currentTarget);
        setActiveMenu(menu);
    };

    const handleDropdownClose = () => {
        setAnchorEl(null);
        setActiveMenu(null);
    };

    const hasChildrenOrPages = (menu) => {
        return (
            menu.pages?.length > 0 ||
            menu.children?.length > 0
        );
    };

    const isMenuActive = (menu) => {
        if (
            location.pathname ===
            `/menu/${menu.slug}`
        ) {
            return true;
        }

        const pageSlugs = [
            ...(menu.pages ?? []).map(
                (page) => page.slug
            ),

            ...(menu.children ?? []).flatMap(
                (child) =>
                    (child.pages ?? []).map(
                        (page) => page.slug
                    )
            ),
        ];

        return pageSlugs.some(
            (slug) =>
                location.pathname ===
                `/page/${slug}`
        );
    };

    return (

        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: "rgba(255,255,255,0.92)",
                color: "#14213d",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid",
                borderColor: alpha("#14213d", 0.08),
                boxShadow:
                    "0 6px 30px rgba(15,23,42,0.05)",
            }}
        >

            <Container
                maxWidth="xl"
                sx={{
                    px: {
                        xs: 2,
                        md: 4,
                    },
                }}
            >

                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: {
                            xs: 68,
                            md: 76,
                        },
                        gap: 2,
                    }}
                >

                    {/* Brand */}

                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.35,
                            color: "inherit",
                            textDecoration: "none",
                            flexShrink: 0,
                        }}
                    >

                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2.5,
                                background:
                                    "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow:
                                    "0 8px 22px rgba(25,118,210,0.28)",
                            }}
                        >
                            <WebAssetIcon
                                sx={{ fontSize: 24 }}
                            />
                        </Box>

                        <Box>

                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    fontSize: {
                                        xs: 16,
                                        md: 18,
                                    },
                                    letterSpacing: -0.35,
                                    lineHeight: 1.1,
                                    color: "#10233f",
                                }}
                            >
                                Ihsan Saleemkhan
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 9.5,
                                    fontWeight: 800,
                                    color: "primary.main",
                                    textTransform: "uppercase",
                                    letterSpacing: 2,
                                    lineHeight: 1.2,
                                }}
                            >
                                Digital Experience
                            </Typography>

                        </Box>

                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Desktop Navigation */}

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{
                            display: {
                                xs: "none",
                                lg: "flex",
                            },
                        }}
                    >

                        <Button
                            component={NavLink}
                            to="/"
                            end
                            sx={{
                                minWidth: 0,
                                px: 1.75,
                                py: 1,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                                color: "text.secondary",

                                "&.active": {
                                    color: "primary.main",
                                    bgcolor:
                                        alpha(
                                            "#1976d2",
                                            0.08
                                        ),
                                },

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
                            Home
                        </Button>

                        {visibleMenus.map((menu) => {

                            const menuActive =
                                isMenuActive(menu);

                            return (

                                <Button
                                    key={menu.id}
                                    component={
                                        hasChildrenOrPages(
                                            menu
                                        )
                                            ? "button"
                                            : NavLink
                                    }
                                    to={
                                        hasChildrenOrPages(
                                            menu
                                        )
                                            ? undefined
                                            : `/menu/${menu.slug}`
                                    }
                                    end
                                    onClick={
                                        hasChildrenOrPages(
                                            menu
                                        )
                                            ? (event) =>
                                                handleDropdownOpen(
                                                    event,
                                                    menu
                                                )
                                            : undefined
                                    }
                                    endIcon={
                                        hasChildrenOrPages(
                                            menu
                                        )
                                            ? (
                                                <KeyboardArrowDownIcon
                                                    sx={{
                                                        fontSize:
                                                            18,
                                                    }}
                                                />
                                            )
                                            : null
                                    }
                                    sx={{
                                        minWidth: 0,
                                        px: 1.75,
                                        py: 1,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 700,
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
                                    {menu.title}
                                </Button>

                            );

                        })}

                    </Stack>

                    {/* Future language button */}

                    <Button
                        startIcon={<LanguageIcon />}
                        variant="outlined"
                        size="small"
                        disabled
                        sx={{
                            display: {
                                xs: "none",
                                md: "inline-flex",
                            },
                            ml: 1,
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 1.75,
                            borderColor:
                                alpha(
                                    "#14213d",
                                    0.12
                                ),
                            color: "text.secondary",
                        }}
                    >
                        EN
                    </Button>

                    {/* Mobile trigger */}

                    <IconButton
                        onClick={onMenuOpen}
                        sx={{
                            display: {
                                xs: "inline-flex",
                                lg: "none",
                            },
                            ml: 0.5,
                            width: 42,
                            height: 42,
                            borderRadius: 2,
                            color: "#10233f",
                            bgcolor:
                                alpha(
                                    "#1976d2",
                                    0.06
                                ),

                            "&:hover": {
                                bgcolor:
                                    alpha(
                                        "#1976d2",
                                        0.12
                                    ),
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                </Toolbar>

            </Container>

            {/* Desktop Dropdown */}

            <Menu
                anchorEl={anchorEl}
                open={dropdownOpen}
                onClose={handleDropdownClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1.25,
                            minWidth: 280,
                            maxWidth: 360,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                alpha(
                                    "#14213d",
                                    0.08
                                ),
                            boxShadow:
                                "0 18px 50px rgba(15,23,42,0.14)",
                            overflow: "hidden",
                        },
                    },
                }}
                MenuListProps={{
                    sx: {
                        p: 1,
                    },
                }}
            >

                {activeMenu && (

                    <>

                        <MenuItem
                            component={Link}
                            to={`/menu/${activeMenu.slug}`}
                            onClick={handleDropdownClose}
                            sx={{
                                borderRadius: 2,
                                px: 1.5,
                                py: 1.2,
                                fontWeight: 800,
                                color: "primary.main",

                                "&:hover": {
                                    bgcolor:
                                        alpha(
                                            "#1976d2",
                                            0.07
                                        ),
                                },
                            }}
                        >
                            View all {activeMenu.title}
                        </MenuItem>

                        {activeMenu.pages?.length > 0 && (
                            <>
                                <Divider sx={{ my: 0.75 }} />

                                <Box
                                    sx={{
                                        px: 1.5,
                                        pt: 0.5,
                                        pb: 0.75,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 10.5,
                                            fontWeight: 800,
                                            letterSpacing: 1.4,
                                            textTransform:
                                                "uppercase",
                                            color:
                                                "text.disabled",
                                        }}
                                    >
                                        Pages
                                    </Typography>
                                </Box>

                                {activeMenu.pages.map(
                                    (page) => (

                                        <MenuItem
                                            key={page.id}
                                            component={Link}
                                            to={`/page/${page.slug}`}
                                            onClick={
                                                handleDropdownClose
                                            }
                                            sx={{
                                                borderRadius: 2,
                                                px: 1.5,
                                                py: 1.1,
                                                fontSize: 13.5,

                                                "&:hover": {
                                                    bgcolor:
                                                        alpha(
                                                            "#1976d2",
                                                            0.06
                                                        ),
                                                },
                                            }}
                                        >
                                            {page.title}
                                        </MenuItem>

                                    )
                                )}
                            </>
                        )}

                        {activeMenu.children?.map(
                            (child) => (

                                <Box
                                    key={child.id}
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >

                                    <Divider sx={{ my: 0.75 }} />

                                    <Box
                                        component={Link}
                                        to={`/menu/${child.slug}`}
                                        onClick={
                                            handleDropdownClose
                                        }
                                        sx={{
                                            display: "block",
                                            px: 1.5,
                                            py: 0.8,
                                            textDecoration: "none",
                                            borderRadius: 2,

                                            "&:hover": {
                                                bgcolor:
                                                    alpha(
                                                        "#1976d2",
                                                        0.05
                                                    ),
                                            },
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: 800,
                                                color:
                                                    "text.primary",
                                            }}
                                        >
                                            {child.title}
                                        </Typography>

                                    </Box>

                                    {child.pages?.map(
                                        (page) => (

                                            <MenuItem
                                                key={page.id}
                                                component={Link}
                                                to={`/page/${page.slug}`}
                                                onClick={
                                                    handleDropdownClose
                                                }
                                                sx={{
                                                    ml: 1,
                                                    borderRadius: 2,
                                                    px: 1.5,
                                                    py: 1,
                                                    fontSize: 13,
                                                    color:
                                                        "text.secondary",

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
                                                {page.title}
                                            </MenuItem>

                                        )
                                    )}

                                </Box>

                            )
                        )}

                    </>

                )}

            </Menu>

        </AppBar>

    );

};

export default PublicHeader;