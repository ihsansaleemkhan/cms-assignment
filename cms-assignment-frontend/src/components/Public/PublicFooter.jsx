import {
    Box,
    Container,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
    alpha,
} from "@mui/material";

import WebAssetIcon from "@mui/icons-material/WebAsset";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";

import {
    Link,
} from "react-router-dom";

const PublicFooter = ({
    menus = [],
}) => {

    const currentYear = new Date().getFullYear();

    const visibleMenus = menus.filter((menu) => (
        menu.pages?.length > 0 ||
        menu.children?.some(
            (child) => child.pages?.length > 0
        )
    ));

    return (

        <Box
            component="footer"
            sx={{
                mt: "auto",
                bgcolor: "#0d1b2f",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
            }}
        >

            {/* Decorative glow */}

            <Box
                sx={{
                    position: "absolute",
                    top: -180,
                    right: -150,
                    width: 420,
                    height: 420,
                    borderRadius: "50%",
                    bgcolor: alpha("#42a5f5", 0.08),
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    bottom: -220,
                    left: -180,
                    width: 460,
                    height: 460,
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: alpha("#fff", 0.05),
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
                    pt: {
                        xs: 6,
                        md: 8,
                    },
                    pb: 3,
                }}
            >

                <Grid
                    container
                    spacing={{
                        xs: 5,
                        md: 7,
                    }}
                >

                    {/* Brand */}

                    <Grid
                        item
                        xs={12}
                        md={5}
                    >

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >

                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2.75,
                                    background:
                                        "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        "0 10px 26px rgba(25,118,210,0.3)",
                                    flexShrink: 0,
                                }}
                            >
                                <WebAssetIcon
                                    sx={{
                                        fontSize: 26,
                                        color: "#fff",
                                    }}
                                />
                            </Box>

                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 900,
                                        lineHeight: 1.1,
                                        letterSpacing: -0.4,
                                    }}
                                >
                                    Ihsan Saleemkhan
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.35,
                                        fontSize: 10,
                                        fontWeight: 800,
                                        letterSpacing: 2,
                                        textTransform: "uppercase",
                                        color: "#90caf9",
                                    }}
                                >
                                    Senior Software Engineer
                                </Typography>

                            </Box>

                        </Stack>

                        <Typography
                            sx={{
                                mt: 2.75,
                                maxWidth: 500,
                                color: alpha("#fff", 0.68),
                                fontSize: 14.5,
                                lineHeight: 1.8,
                            }}
                        >
                            A dynamic content experience powered by
                            Laravel and React, designed to make published
                            information clear, organized, and easy to explore.
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 3 }}
                        >

                            <IconButton
                                component="a"
                                href="#"
                                aria-label="LinkedIn"
                                sx={{
                                    color: alpha("#fff", 0.72),
                                    bgcolor: alpha("#fff", 0.06),
                                    border: "1px solid",
                                    borderColor: alpha("#fff", 0.08),

                                    "&:hover": {
                                        bgcolor: alpha("#42a5f5", 0.14),
                                        color: "#90caf9",
                                    },
                                }}
                            >
                                <LinkedInIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                                component="a"
                                href="#"
                                aria-label="GitHub"
                                sx={{
                                    color: alpha("#fff", 0.72),
                                    bgcolor: alpha("#fff", 0.06),
                                    border: "1px solid",
                                    borderColor: alpha("#fff", 0.08),

                                    "&:hover": {
                                        bgcolor: alpha("#42a5f5", 0.14),
                                        color: "#90caf9",
                                    },
                                }}
                            >
                                <GitHubIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                                disabled
                                aria-label="Language"
                                sx={{
                                    color: alpha("#fff", 0.45),
                                    bgcolor: alpha("#fff", 0.04),
                                    border: "1px solid",
                                    borderColor: alpha("#fff", 0.06),
                                }}
                            >
                                <LanguageIcon fontSize="small" />
                            </IconButton>

                        </Stack>

                    </Grid>

                    {/* Dynamic navigation */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <Typography
                            sx={{
                                mb: 2,
                                fontSize: 12,
                                fontWeight: 900,
                                color: "#90caf9",
                                textTransform: "uppercase",
                                letterSpacing: 1.6,
                            }}
                        >
                            Explore
                        </Typography>

                        <Stack spacing={1.25}>

                            <FooterLink
                                label="Home"
                                to="/"
                            />

                            {visibleMenus.slice(0, 6).map(
                                (menu) => (
                                    <FooterLink
                                        key={menu.id}
                                        label={menu.title}
                                        to={`/menu/${menu.slug}`}
                                    />
                                )
                            )}

                        </Stack>

                    </Grid>

                    {/* Published pages */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <Typography
                            sx={{
                                mb: 2,
                                fontSize: 12,
                                fontWeight: 900,
                                color: "#90caf9",
                                textTransform: "uppercase",
                                letterSpacing: 1.6,
                            }}
                        >
                            Latest Content
                        </Typography>

                        <Stack spacing={1.25}>

                            {visibleMenus
                                .flatMap((menu) => [
                                    ...(menu.pages ?? []),
                                    ...(menu.children ?? []).flatMap(
                                        (child) => child.pages ?? []
                                    ),
                                ])
                                .slice(0, 6)
                                .map((page) => (
                                    <FooterLink
                                        key={page.id}
                                        label={page.title}
                                        to={`/page/${page.slug}`}
                                    />
                                ))}

                            {visibleMenus.length === 0 && (
                                <Typography
                                    sx={{
                                        color: alpha("#fff", 0.55),
                                        fontSize: 13.5,
                                    }}
                                >
                                    Published content will appear here.
                                </Typography>
                            )}

                        </Stack>

                    </Grid>

                </Grid>

                <Divider
                    sx={{
                        my: {
                            xs: 4,
                            md: 5,
                        },
                        borderColor: alpha("#fff", 0.08),
                    }}
                />

                {/* Bottom row */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                    spacing={1.5}
                >

                    <Typography
                        sx={{
                            color: alpha("#fff", 0.5),
                            fontSize: 12.5,
                        }}
                    >
                        © {currentYear} Ihsan Saleemkhan. All rights reserved.
                    </Typography>

                    <Typography
                        sx={{
                            color: alpha("#fff", 0.46),
                            fontSize: 12.5,
                        }}
                    >
                        Powered by Laravel, React and Material UI
                    </Typography>

                </Stack>

            </Container>

        </Box>

    );

};

const FooterLink = ({
    label,
    to,
}) => {

    return (

        <Box
            component={Link}
            to={to}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                width: "fit-content",
                color: alpha("#fff", 0.68),
                textDecoration: "none",
                fontSize: 13.5,
                fontWeight: 600,
                transition: "all 0.2s ease",

                "&:hover": {
                    color: "#90caf9",
                    transform: "translateX(4px)",
                },

                "&:hover .footer-arrow": {
                    opacity: 1,
                    transform: "translateX(0)",
                },
            }}
        >

            <ArrowForwardIcon
                className="footer-arrow"
                sx={{
                    fontSize: 15,
                    opacity: 0,
                    transform: "translateX(-4px)",
                    transition: "all 0.2s ease",
                }}
            />

            {label}

        </Box>

    );

};

export default PublicFooter;