import {
    Box,
    Button,
    Chip,
    Container,
    Stack,
    Typography,
    alpha,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";

import { Link } from "react-router-dom";

import {
    getLocalizedTitle,
} from "../../utils/localization";

const HeroSection = ({
    featuredPage,
    totalPages = 0,
    totalMenus = 0,
    language = "en",
    isArabic = false,
}) => {

    const hasFeaturedPage =
        Boolean(featuredPage);

    const featuredTitle =
        getLocalizedTitle(
            featuredPage,
            language
        );

    const featuredMenuTitle =
        getLocalizedTitle(
            featuredPage?.menu,
            language
        );

    const content = isArabic
        ? {
            badge: "تجربة محتوى ديناميكية",
            heading:
                "اكتشف محتوى مصمم لتجربة رقمية حديثة.",
            description:
                "تصفح الصفحات المنشورة من خلال قائمة ديناميكية ومنظمة، واستكشف محتوى محدثاً وسهل الوصول.",
            exploreFeatured:
                "استكشف الصفحة المميزة",
            browseContent:
                "تصفح المحتوى",
            publishedPages:
                "الصفحات المنشورة",
            contentMenus:
                "قوائم المحتوى",
            featured:
                "مميز",
            fallbackTitle:
                "استكشف أحدث المحتويات المنشورة",
            readFullPage:
                "قراءة الصفحة كاملة",
        }
        : {
            badge:
                "Dynamic content experience",
            heading:
                "Discover content built for a modern digital experience.",
            description:
                "Browse published pages through a dynamic, structured menu and explore content that is always current, organized, and easy to access.",
            exploreFeatured:
                "Explore Featured Page",
            browseContent:
                "Browse Content",
            publishedPages:
                "Published Pages",
            contentMenus:
                "Content Menus",
            featured:
                "Featured",
            fallbackTitle:
                "Explore our latest published content",
            readFullPage:
                "Read full page",
        };

    const DirectionArrow =
        isArabic
            ? ArrowBackIcon
            : ArrowForwardIcon;

    return (

        <Box
            component="section"
            dir={
                isArabic
                    ? "rtl"
                    : "ltr"
            }
            sx={{
                position: "relative",
                overflow: "hidden",
                bgcolor: "#eef5ff",

                backgroundImage: `
                    radial-gradient(
                        circle at ${
                            isArabic
                                ? "92% 10%"
                                : "8% 10%"
                        },
                        rgba(66,165,245,0.18),
                        transparent 34%
                    ),
                    radial-gradient(
                        circle at ${
                            isArabic
                                ? "10% 24%"
                                : "90% 24%"
                        },
                        rgba(25,118,210,0.14),
                        transparent 30%
                    ),
                    linear-gradient(
                        135deg,
                        #f8fbff 0%,
                        #eef5ff 48%,
                        #e8f2ff 100%
                    )
                `,

                borderBottom: "1px solid",
                borderColor:
                    alpha(
                        "#14213d",
                        0.07
                    ),
            }}
        >

            {/* Decorative circles */}

            <Box
                sx={{
                    position: "absolute",
                    top: -120,

                    right: isArabic
                        ? "auto"
                        : -80,

                    left: isArabic
                        ? -80
                        : "auto",

                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor:
                        alpha(
                            "#1976d2",
                            0.12
                        ),
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    bottom: -180,

                    left: isArabic
                        ? "auto"
                        : -120,

                    right: isArabic
                        ? -120
                        : "auto",

                    width: 380,
                    height: 380,
                    borderRadius: "50%",
                    bgcolor:
                        alpha(
                            "#1976d2",
                            0.04
                        ),
                    pointerEvents: "none",
                }}
            />

            <Container
                maxWidth="xl"
                sx={{
                    position: "relative",
                    zIndex: 1,

                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },

                    py: {
                        xs: 6,
                        sm: 8,
                        md: 10,
                    },
                }}
            >

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",

                            lg: isArabic
                                ? "minmax(420px, 0.95fr) minmax(0, 1.05fr)"
                                : "minmax(0, 1.05fr) minmax(420px, 0.95fr)",
                        },

                        gap: {
                            xs: 5,
                            lg: 7,
                        },

                        alignItems: "center",
                    }}
                >

                    {/* Hero content */}

                    <Box
                        sx={{
                            order: {
                                xs: 1,
                                lg: isArabic
                                    ? 2
                                    : 1,
                            },

                            textAlign: isArabic
                                ? "right"
                                : "left",
                        }}
                    >

                        <Chip
                            icon={
                                <AutoAwesomeIcon
                                    sx={{
                                        fontSize: 17,
                                    }}
                                />
                            }
                            label={content.badge}
                            sx={{
                                mb: 3,
                                height: 34,
                                borderRadius: 20,
                                bgcolor:
                                    alpha(
                                        "#1976d2",
                                        0.09
                                    ),
                                color:
                                    "primary.main",
                                fontWeight: 800,
                                fontSize: 12,
                                border: "1px solid",
                                borderColor:
                                    alpha(
                                        "#1976d2",
                                        0.14
                                    ),

                                "& .MuiChip-icon": {
                                    color:
                                        "primary.main",
                                },
                            }}
                        />

                        <Typography
                            component="h1"
                            sx={{
                                maxWidth: 760,
                                ml: isArabic
                                    ? "auto"
                                    : 0,
                                mr: isArabic
                                    ? 0
                                    : "auto",

                                fontSize: {
                                    xs: 40,
                                    sm: 52,
                                    md: 62,
                                },

                                lineHeight: {
                                    xs: 1.15,
                                    md: isArabic
                                        ? 1.18
                                        : 1.02,
                                },

                                letterSpacing:
                                    isArabic
                                        ? 0
                                        : {
                                            xs: -1.5,
                                            md: -2.4,
                                        },

                                fontWeight: 900,
                                color: "#10233f",

                                fontFamily: isArabic
                                    ? "'Noto Sans Arabic', Tahoma, Arial, sans-serif"
                                    : "inherit",
                            }}
                        >
                            {content.heading}
                        </Typography>

                        <Typography
                            sx={{
                                maxWidth: 680,
                                mt: 3,

                                ml: isArabic
                                    ? "auto"
                                    : 0,

                                mr: isArabic
                                    ? 0
                                    : "auto",

                                fontSize: {
                                    xs: 16,
                                    md: 18,
                                },

                                lineHeight: isArabic
                                    ? 2
                                    : 1.75,

                                color: "#5b677a",
                            }}
                        >
                            {content.description}
                        </Typography>

                        <Stack
                            direction={{
                                xs: "column",

                                sm: isArabic
                                    ? "row-reverse"
                                    : "row",
                            }}
                            spacing={1.5}
                            sx={{
                                mt: 4,

                                alignItems: {
                                    xs: "stretch",
                                    sm: "center",
                                },

                                justifyContent:
                                    isArabic
                                        ? "flex-start"
                                        : "flex-start",
                            }}
                        >

                            {hasFeaturedPage && (

                                <Button
                                    component={Link}
                                    to={`/page/${featuredPage.slug}`}
                                    variant="contained"

                                    endIcon={
                                        <DirectionArrow />
                                    }

                                    sx={{
                                        px: 3.5,
                                        py: 1.4,
                                        borderRadius: 2.5,
                                        textTransform:
                                            "none",
                                        fontSize: 14,
                                        fontWeight: 800,
                                        boxShadow:
                                            "0 12px 28px rgba(25,118,210,0.26)",

                                        "& .MuiButton-endIcon":
                                            {
                                                ml: isArabic
                                                    ? 0
                                                    : 1,
                                                mr: isArabic
                                                    ? 1
                                                    : 0,
                                            },

                                        "&:hover": {
                                            boxShadow:
                                                "0 16px 34px rgba(25,118,210,0.34)",
                                        },
                                    }}
                                >
                                    {content.exploreFeatured}
                                </Button>

                            )}

                            <Button
                                component="a"
                                href="#featured-pages"
                                variant="outlined"

                                startIcon={
                                    <ExploreOutlinedIcon />
                                }

                                sx={{
                                    px: 3,
                                    py: 1.35,
                                    borderRadius: 2.5,
                                    textTransform:
                                        "none",
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: "#10233f",
                                    borderColor:
                                        alpha(
                                            "#10233f",
                                            0.16
                                        ),
                                    bgcolor:
                                        alpha(
                                            "#fff",
                                            0.5
                                        ),

                                    "& .MuiButton-startIcon":
                                        {
                                            ml: isArabic
                                                ? 1
                                                : -0.5,
                                            mr: isArabic
                                                ? -0.5
                                                : 1,
                                        },

                                    "&:hover": {
                                        borderColor:
                                            "primary.main",
                                        bgcolor:
                                            alpha(
                                                "#fff",
                                                0.9
                                            ),
                                        color:
                                            "primary.main",
                                    },
                                }}
                            >
                                {content.browseContent}
                            </Button>

                        </Stack>

                        {/* Statistics */}

                        <Stack
                            direction={
                                isArabic
                                    ? "row-reverse"
                                    : "row"
                            }
                            flexWrap="wrap"
                            spacing={1}
                            useFlexGap
                            sx={{
                                mt: 4.5,
                                justifyContent:
                                    isArabic
                                        ? "flex-start"
                                        : "flex-start",
                            }}
                        >

                            <StatisticBox
                                value={totalPages}
                                label={
                                    content.publishedPages
                                }
                                isArabic={isArabic}
                            />

                            <StatisticBox
                                value={totalMenus}
                                label={
                                    content.contentMenus
                                }
                                isArabic={isArabic}
                            />

                        </Stack>

                    </Box>

                    {/* Featured visual */}

                    <Box
                        sx={{
                            order: {
                                xs: 2,
                                lg: isArabic
                                    ? 1
                                    : 2,
                            },

                            position: "relative",

                            mx: {
                                xs: "auto",
                                lg: 0,
                            },

                            width: "100%",
                            maxWidth: 620,
                        }}
                    >

                        <Box
                            sx={{
                                position: "absolute",

                                inset: {
                                    xs: isArabic
                                        ? "20px 20px -15px -10px"
                                        : "20px -10px -15px 20px",

                                    sm: isArabic
                                        ? "28px 30px -20px -20px"
                                        : "28px -20px -20px 30px",
                                },

                                borderRadius: 5,
                                bgcolor:
                                    alpha(
                                        "#1976d2",
                                        0.1
                                    ),

                                transform: isArabic
                                    ? "rotate(-3deg)"
                                    : "rotate(3deg)",
                            }}
                        />

                        <Box
                            sx={{
                                position: "relative",
                                overflow: "hidden",

                                minHeight: {
                                    xs: 360,
                                    sm: 460,
                                    lg: 520,
                                },

                                borderRadius: {
                                    xs: 4,
                                    md: 5,
                                },

                                bgcolor: "#10233f",
                                border: "1px solid",
                                borderColor:
                                    alpha(
                                        "#fff",
                                        0.18
                                    ),

                                boxShadow:
                                    "0 28px 70px rgba(15,35,63,0.22)",
                            }}
                        >

                            {featuredPage?.cover_image ? (

                                <Box
                                    component="img"
                                    src={
                                        featuredPage.cover_image
                                    }
                                    alt={
                                        featuredTitle ||
                                        featuredPage.title
                                    }
                                    sx={{
                                        position:
                                            "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />

                            ) : (

                                <Box
                                    sx={{
                                        position:
                                            "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        background:
                                            "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
                                    }}
                                >

                                    <DescriptionOutlinedIcon
                                        sx={{
                                            fontSize: 100,
                                            color:
                                                alpha(
                                                    "#fff",
                                                    0.78
                                                ),
                                        }}
                                    />

                                </Box>

                            )}

                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(180deg, rgba(16,35,63,0.08) 18%, rgba(16,35,63,0.84) 100%)",
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: 0,

                                    p: {
                                        xs: 3,
                                        sm: 4,
                                    },

                                    color: "#fff",

                                    textAlign: isArabic
                                        ? "right"
                                        : "left",
                                }}
                            >

                                <Chip
                                    label={
                                        featuredMenuTitle ||
                                        content.featured
                                    }
                                    size="small"
                                    sx={{
                                        mb: 1.5,
                                        bgcolor:
                                            alpha(
                                                "#fff",
                                                0.16
                                            ),
                                        color: "#fff",
                                        fontSize: 11,
                                        fontWeight: 800,
                                        backdropFilter:
                                            "blur(10px)",
                                        border:
                                            "1px solid",
                                        borderColor:
                                            alpha(
                                                "#fff",
                                                0.2
                                            ),
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 25,
                                            sm: 32,
                                        },

                                        lineHeight: isArabic
                                            ? 1.5
                                            : 1.15,

                                        fontWeight: 900,

                                        letterSpacing:
                                            isArabic
                                                ? 0
                                                : -0.7,

                                        maxWidth: 480,

                                        ml: isArabic
                                            ? "auto"
                                            : 0,
                                    }}
                                >
                                    {featuredTitle ||
                                        content.fallbackTitle}
                                </Typography>

                                {hasFeaturedPage && (

                                    <Button
                                        component={Link}
                                        to={`/page/${featuredPage.slug}`}

                                        endIcon={
                                            <DirectionArrow />
                                        }

                                        sx={{
                                            mt: 2,
                                            p: 0,
                                            minWidth: 0,
                                            color: "#fff",
                                            textTransform:
                                                "none",
                                            fontWeight: 800,

                                            "& .MuiButton-endIcon":
                                                {
                                                    ml: isArabic
                                                        ? 0
                                                        : 1,
                                                    mr: isArabic
                                                        ? 1
                                                        : 0,
                                                },

                                            "&:hover": {
                                                bgcolor:
                                                    "transparent",
                                                color:
                                                    "#bbdefb",
                                            },
                                        }}
                                    >
                                        {content.readFullPage}
                                    </Button>

                                )}

                            </Box>

                        </Box>

                    </Box>

                </Box>

            </Container>

        </Box>

    );

};

const StatisticBox = ({
    value,
    label,
    isArabic = false,
}) => (

    <Box
        sx={{
            px: 2,
            py: 1.35,
            minWidth: 130,
            borderRadius: 2.5,
            bgcolor:
                alpha(
                    "#fff",
                    0.72
                ),
            border: "1px solid",
            borderColor:
                alpha(
                    "#14213d",
                    0.08
                ),
            backdropFilter:
                "blur(10px)",
            textAlign: isArabic
                ? "right"
                : "left",
        }}
    >

        <Typography
            sx={{
                fontSize: 22,
                fontWeight: 900,
                color: "#10233f",
                lineHeight: 1,
            }}
        >
            {value}
        </Typography>

        <Typography
            sx={{
                mt: 0.6,
                fontSize: 11.5,
                fontWeight: 700,
                color:
                    "text.secondary",

                textTransform:
                    isArabic
                        ? "none"
                        : "uppercase",

                letterSpacing:
                    isArabic
                        ? 0
                        : 0.8,
            }}
        >
            {label}
        </Typography>

    </Box>

);

export default HeroSection;