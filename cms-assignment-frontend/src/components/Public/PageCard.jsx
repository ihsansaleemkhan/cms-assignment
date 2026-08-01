import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Stack,
    Typography,
    alpha,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import { Link } from "react-router-dom";

const formatDate = (value) => {
    if (!value) return null;

    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const PageCard = ({
    page,
    featured = false,
}) => {

    if (!page) {
        return null;
    }

    const publishedDate = formatDate(
        page.publish_date
    );

    return (

        <Card
            component={Link}
            to={`/page/${page.slug}`}
            elevation={0}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: featured
                    ? {
                        xs: "column",
                        md: "row",
                    }
                    : "column",
                textDecoration: "none",
                color: "inherit",
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "#fff",
                border: "1px solid",
                borderColor: alpha("#14213d", 0.08),
                boxShadow:
                    "0 10px 30px rgba(15,23,42,0.06)",
                transition:
                    "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",

                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow:
                        "0 18px 44px rgba(15,23,42,0.12)",
                    borderColor: alpha("#1976d2", 0.22),
                },

                "&:hover .page-card-image": {
                    transform: "scale(1.045)",
                },

                "&:hover .page-card-action": {
                    transform: "translateX(4px)",
                },
            }}
        >

            {/* Image */}

            <Box
                sx={{
                    position: "relative",
                    width: featured
                        ? {
                            xs: "100%",
                            md: "48%",
                        }
                        : "100%",
                    minHeight: featured
                        ? {
                            xs: 260,
                            md: 380,
                        }
                        : 230,
                    flexShrink: 0,
                    overflow: "hidden",
                    bgcolor: "#eaf2fb",
                }}
            >

                {page.cover_image ? (

                    <CardMedia
                        component="img"
                        image={page.cover_image}
                        alt={page.title}
                        className="page-card-image"
                        sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition:
                                "transform 0.45s ease",
                        }}
                    />

                ) : (

                    <Box
                        className="page-card-image"
                        sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
                            transition:
                                "transform 0.45s ease",
                        }}
                    >
                        <DescriptionOutlinedIcon
                            sx={{
                                fontSize: featured
                                    ? 88
                                    : 64,
                                color: alpha("#fff", 0.8),
                            }}
                        />
                    </Box>

                )}

                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(180deg, rgba(16,35,63,0.02) 35%, rgba(16,35,63,0.44) 100%)",
                    }}
                />

                {page.menu?.title && (

                    <Chip
                        label={page.menu.title}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            bgcolor: alpha("#fff", 0.9),
                            color: "#10233f",
                            fontSize: 11,
                            fontWeight: 800,
                            backdropFilter: "blur(8px)",
                            border: "1px solid",
                            borderColor: alpha("#fff", 0.55),
                        }}
                    />

                )}

            </Box>

            {/* Content */}

            <CardContent
                sx={{
                    p: featured
                        ? {
                            xs: 3,
                            sm: 4,
                            md: 5,
                        }
                        : 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",

                    "&:last-child": {
                        pb: featured
                            ? {
                                xs: 3,
                                sm: 4,
                                md: 5,
                            }
                            : 3,
                    },
                }}
            >

                <Box>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mb: 1.5 }}
                    >

                        {publishedDate && (

                            <Stack
                                direction="row"
                                spacing={0.65}
                                alignItems="center"
                            >

                                <CalendarTodayOutlinedIcon
                                    sx={{
                                        fontSize: 15,
                                        color: "text.disabled",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "text.secondary",
                                    }}
                                >
                                    {publishedDate}
                                </Typography>

                            </Stack>

                        )}

                        {featured && (

                            <Chip
                                label="Featured"
                                size="small"
                                color="primary"
                                sx={{
                                    height: 22,
                                    fontSize: 10.5,
                                    fontWeight: 800,
                                }}
                            />

                        )}

                    </Stack>

                    <Typography
                        component="h3"
                        sx={{
                            fontSize: featured
                                ? {
                                    xs: 25,
                                    md: 32,
                                }
                                : 20,
                            fontWeight: 900,
                            lineHeight: 1.18,
                            letterSpacing: featured
                                ? -0.7
                                : -0.3,
                            color: "#10233f",
                        }}
                    >
                        {page.title}
                    </Typography>

                    {featured && (

                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: 15,
                                lineHeight: 1.75,
                                color: "text.secondary",
                            }}
                        >
                            Explore this published page and discover
                            the complete content, details, and related
                            information.
                        </Typography>

                    )}

                </Box>

                <Button
                    component="span"
                    className="page-card-action"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                        alignSelf: "flex-start",
                        mt: 3,
                        p: 0,
                        minWidth: 0,
                        textTransform: "none",
                        fontWeight: 800,
                        color: "primary.main",
                        transition:
                            "transform 0.2s ease",

                        "&:hover": {
                            bgcolor: "transparent",
                        },
                    }}
                >
                    Read Page
                </Button>

            </CardContent>

        </Card>

    );

};

export default PageCard;