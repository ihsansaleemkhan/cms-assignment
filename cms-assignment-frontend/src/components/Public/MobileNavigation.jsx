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

const MobileNavigation = ({
    open,
    menus = [],
    onClose,
}) => {

    const location = useLocation();

    const [expandedMenus, setExpandedMenus] = useState({});

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

    return (

        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true,
            }}
            PaperProps={{
                sx: {
                    width: {
                        xs: "88vw",
                        sm: 390,
                    },
                    maxWidth: 420,
                    bgcolor: "#fff",
                    borderLeft: "1px solid",
                    borderColor: "divider",
                    boxShadow:
                        "-16px 0 48px rgba(15,23,42,0.16)",
                },
            }}
        >

            <Box
                sx={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
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
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.25}
                            sx={{ minWidth: 0 }}
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
                                    sx={{ fontSize: 22 }}
                                />
                            </Box>

                            <Box sx={{ minWidth: 0 }}>

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
                                        fontSize: 9.5,
                                        fontWeight: 800,
                                        color: "primary.main",
                                        letterSpacing: 1.7,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Digital Experience
                                </Typography>

                            </Box>

                        </Stack>

                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={{
                                bgcolor: alpha("#14213d", 0.05),
                                color: "#10233f",

                                "&:hover": {
                                    bgcolor: alpha("#14213d", 0.1),
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
                            letterSpacing: 1.6,
                            textTransform: "uppercase",
                        }}
                    >
                        Navigation
                    </Typography>

                    <List disablePadding>

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
                                    ? alpha("#1976d2", 0.08)
                                    : "transparent",

                                "&:hover": {
                                    bgcolor: alpha("#1976d2", 0.06),
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
                                primary="Home"
                                primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                }}
                            />

                        </ListItemButton>

                        {menus.map((menu) => {

                            const expanded =
                                Boolean(
                                    expandedMenus[menu.id]
                                );

                            const menuActive =
                                isPathActive(
                                    `/menu/${menu.slug}`
                                );

                            const expandable =
                                hasMenuContent(menu);

                            return (

                                <Box key={menu.id}>

                                    <ListItemButton
                                        onClick={() => {
                                            if (expandable) {
                                                toggleMenu(menu.id);
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
                                            primary={menu.title}
                                            primaryTypographyProps={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                            }}
                                        />

                                        {expandable && (
                                            expanded
                                                ? (
                                                    <KeyboardArrowDownIcon />
                                                )
                                                : (
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
                                                    ml: 2,
                                                    pl: 1.5,
                                                    mb: 1,
                                                    borderLeft:
                                                        "1px solid",
                                                    borderColor:
                                                        alpha(
                                                            "#1976d2",
                                                            0.16
                                                        ),
                                                }}
                                            >

                                                <ListItemButton
                                                    component={Link}
                                                    to={`/menu/${menu.slug}`}
                                                    onClick={onClose}
                                                    sx={{
                                                        py: 0.85,
                                                        px: 1.25,
                                                        borderRadius: 1.75,
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
                                                        primary={`View all ${menu.title}`}
                                                        primaryTypographyProps={{
                                                            fontSize: 13,
                                                            fontWeight: 800,
                                                        }}
                                                    />

                                                </ListItemButton>

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
                                                                borderRadius: 1.75,
                                                                color:
                                                                    isPathActive(
                                                                        `/page/${page.slug}`
                                                                    )
                                                                        ? "primary.main"
                                                                        : "text.secondary",

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
                                                                    minWidth: 30,
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
                                                                primary={page.title}
                                                                primaryTypographyProps={{
                                                                    fontSize: 13,
                                                                    fontWeight: 600,
                                                                }}
                                                            />

                                                        </ListItemButton>

                                                    )
                                                )}

                                                {menu.children?.map(
                                                    (child) => (

                                                        <Box
                                                            key={child.id}
                                                            sx={{ mt: 0.5 }}
                                                        >

                                                            <ListItemButton
                                                                component={Link}
                                                                to={`/menu/${child.slug}`}
                                                                onClick={onClose}
                                                                sx={{
                                                                    py: 0.8,
                                                                    px: 1.25,
                                                                    borderRadius: 1.75,
                                                                    color:
                                                                        "text.primary",

                                                                    "&:hover": {
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
                                                                        child.title
                                                                    }
                                                                    primaryTypographyProps={{
                                                                        fontSize:
                                                                            12.5,
                                                                        fontWeight:
                                                                            800,
                                                                    }}
                                                                />

                                                            </ListItemButton>

                                                            {child.pages?.map(
                                                                (page) => (

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
                                                                            ml: 1,
                                                                            py: 0.75,
                                                                            px: 1.25,
                                                                            borderRadius:
                                                                                1.75,
                                                                            color:
                                                                                "text.secondary",

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
                                                                                page.title
                                                                            }
                                                                            primaryTypographyProps={{
                                                                                fontSize:
                                                                                    12.5,
                                                                                fontWeight:
                                                                                    600,
                                                                            }}
                                                                        />

                                                                    </ListItemButton>

                                                                )
                                                            )}

                                                        </Box>

                                                    )
                                                )}

                                            </Box>

                                        </Collapse>

                                    )}

                                </Box>

                            );

                        })}

                    </List>

                </Box>

                {/* Language placeholder */}

                <Box
                    sx={{
                        p: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        bgcolor: "#fafbfc",
                    }}
                >

                    <ListItemButton
                        disabled
                        sx={{
                            borderRadius: 2,
                            px: 1.5,
                            py: 1,
                        }}
                    >

                        <ListItemIcon
                            sx={{
                                minWidth: 38,
                            }}
                        >
                            <LanguageIcon />
                        </ListItemIcon>

                        <ListItemText
                            primary="English"
                            secondary="Arabic support coming next"
                            primaryTypographyProps={{
                                fontSize: 13.5,
                                fontWeight: 700,
                            }}
                            secondaryTypographyProps={{
                                fontSize: 11,
                            }}
                        />

                    </ListItemButton>

                </Box>

            </Box>

        </Drawer>

    );

};

export default MobileNavigation;