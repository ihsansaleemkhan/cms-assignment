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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";

import { Link } from "react-router-dom";

const HeroSection = ({
    featuredPage,
    totalPages = 0,
    totalMenus = 0,
}) => {

    const hasFeaturedPage = Boolean(featuredPage);

    return (

        <Box
            component="section"
            sx={{
                position: "relative",
                overflow: "hidden",
                bgcolor: "#eef5ff",
                backgroundImage: `
                    radial-gradient(
                        circle at 8% 10%,
                        rgba(66,165,245,0.18),
                        transparent 34%
                    ),
                    radial-gradient(
                        circle at 90% 24%,
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
                borderColor: alpha("#14213d", 0.07),
            }}
        >

            {/* Decorative circles */}

            <Box
                sx={{
                    position: "absolute",
                    top: -120,
                    right: -80,
                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: alpha("#1976d2", 0.12),
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    bottom: -180,
                    left: -120,
                    width: 380,
                    height: 380,
                    borderRadius: "50%",
                    bgcolor: alpha("#1976d2", 0.04),
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
                            lg: "minmax(0, 1.05fr) minmax(420px, 0.95fr)",
                        },
                        gap: {
                            xs: 5,
                            lg: 7,
                        },
                        alignItems: "center",
                    }}
                >

                    {/* Hero content */}

                    <Box>

                        <Chip
                            icon={
                                <AutoAwesomeIcon
                                    sx={{ fontSize: 17 }}
                                />
                            }
                            label="Dynamic content experience"
                            sx={{
                                mb: 3,
                                height: 34,
                                borderRadius: 20,
                                bgcolor: alpha("#1976d2", 0.09),
                                color: "primary.main",
                                fontWeight: 800,
                                fontSize: 12,
                                border: "1px solid",
                                borderColor: alpha("#1976d2", 0.14),

                                "& .MuiChip-icon": {
                                    color: "primary.main",
                                },
                            }}
                        />

                        <Typography
                            component="h1"
                            sx={{
                                maxWidth: 760,
                                fontSize: {
                                    xs: 40,
                                    sm: 52,
                                    md: 62,
                                },
                                lineHeight: {
                                    xs: 1.08,
                                    md: 1.02,
                                },
                                letterSpacing: {
                                    xs: -1.5,
                                    md: -2.4,
                                },
                                fontWeight: 900,
                                color: "#10233f",
                            }}
                        >
                            Discover content built for a
                            modern digital experience.
                        </Typography>

                        <Typography
                            sx={{
                                maxWidth: 680,
                                mt: 3,
                                fontSize: {
                                    xs: 16,
                                    md: 18,
                                },
                                lineHeight: 1.75,
                                color: "#5b677a",
                            }}
                        >
                            Browse published pages through a dynamic,
                            structured menu and explore content that is
                            always current, organized, and easy to access.
                        </Typography>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={1.5}
                            sx={{
                                mt: 4,
                                alignItems: {
                                    xs: "stretch",
                                    sm: "center",
                                },
                            }}
                        >

                            {hasFeaturedPage && (

                                <Button
                                    component={Link}
                                    to={`/page/${featuredPage.slug}`}
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        px: 3.5,
                                        py: 1.4,
                                        borderRadius: 2.5,
                                        textTransform: "none",
                                        fontSize: 14,
                                        fontWeight: 800,
                                        boxShadow:
                                            "0 12px 28px rgba(25,118,210,0.26)",

                                        "&:hover": {
                                            boxShadow:
                                                "0 16px 34px rgba(25,118,210,0.34)",
                                        },
                                    }}
                                >
                                    Explore Featured Page
                                </Button>

                            )}

                            <Button
                                component="a"
                                href="#featured-pages"
                                variant="outlined"
                                startIcon={<ExploreOutlinedIcon />}
                                sx={{
                                    px: 3,
                                    py: 1.35,
                                    borderRadius: 2.5,
                                    textTransform: "none",
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: "#10233f",
                                    borderColor: alpha("#10233f", 0.16),
                                    bgcolor: alpha("#fff", 0.5),

                                    "&:hover": {
                                        borderColor: "primary.main",
                                        bgcolor: alpha("#fff", 0.9),
                                        color: "primary.main",
                                    },
                                }}
                            >
                                Browse Content
                            </Button>

                        </Stack>

                        {/* Statistics */}

                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            spacing={1}
                            useFlexGap
                            sx={{ mt: 4.5 }}
                        >

                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.35,
                                    minWidth: 130,
                                    borderRadius: 2.5,
                                    bgcolor: alpha("#fff", 0.72),
                                    border: "1px solid",
                                    borderColor: alpha("#14213d", 0.08),
                                    backdropFilter: "blur(10px)",
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
                                    {totalPages}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.6,
                                        fontSize: 11.5,
                                        fontWeight: 700,
                                        color: "text.secondary",
                                        textTransform: "uppercase",
                                        letterSpacing: 0.8,
                                    }}
                                >
                                    Published Pages
                                </Typography>

                            </Box>

                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.35,
                                    minWidth: 130,
                                    borderRadius: 2.5,
                                    bgcolor: alpha("#fff", 0.72),
                                    border: "1px solid",
                                    borderColor: alpha("#14213d", 0.08),
                                    backdropFilter: "blur(10px)",
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
                                    {totalMenus}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.6,
                                        fontSize: 11.5,
                                        fontWeight: 700,
                                        color: "text.secondary",
                                        textTransform: "uppercase",
                                        letterSpacing: 0.8,
                                    }}
                                >
                                    Content Menus
                                </Typography>

                            </Box>

                        </Stack>

                    </Box>

                    {/* Featured visual */}

                    <Box
                        sx={{
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
                                    xs: "20px -10px -15px 20px",
                                    sm: "28px -20px -20px 30px",
                                },
                                borderRadius: 5,
                                bgcolor: alpha("#1976d2", 0.1),
                                transform: "rotate(3deg)",
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
                                borderColor: alpha("#fff", 0.18),
                                boxShadow:
                                    "0 28px 70px rgba(15,35,63,0.22)",
                            }}
                        >

                            {featuredPage?.cover_image ? (

                                <Box
                                    component="img"
                                    src={featuredPage.cover_image}
                                    alt={featuredPage.title}
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />

                            ) : (

                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background:
                                            "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
                                    }}
                                >

                                    <DescriptionOutlinedIcon
                                        sx={{
                                            fontSize: 100,
                                            color: alpha("#fff", 0.78),
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
                                }}
                            >

                                <Chip
                                    label={
                                        featuredPage?.menu?.title ??
                                        "Featured"
                                    }
                                    size="small"
                                    sx={{
                                        mb: 1.5,
                                        bgcolor: alpha("#fff", 0.16),
                                        color: "#fff",
                                        fontSize: 11,
                                        fontWeight: 800,
                                        backdropFilter: "blur(10px)",
                                        border: "1px solid",
                                        borderColor: alpha("#fff", 0.2),
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 25,
                                            sm: 32,
                                        },
                                        lineHeight: 1.15,
                                        fontWeight: 900,
                                        letterSpacing: -0.7,
                                        maxWidth: 480,
                                    }}
                                >
                                    {featuredPage?.title ??
                                        "Explore our latest published content"}
                                </Typography>

                                {hasFeaturedPage && (

                                    <Button
                                        component={Link}
                                        to={`/page/${featuredPage.slug}`}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            mt: 2,
                                            p: 0,
                                            minWidth: 0,
                                            color: "#fff",
                                            textTransform: "none",
                                            fontWeight: 800,

                                            "&:hover": {
                                                bgcolor: "transparent",
                                                color: "#bbdefb",
                                            },
                                        }}
                                    >
                                        Read full page
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

export default HeroSection;