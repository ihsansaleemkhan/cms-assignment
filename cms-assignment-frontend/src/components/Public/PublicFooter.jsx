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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";

import { Link } from "react-router-dom";

import {
    getLocalizedTitle,
} from "../../utils/localization";

const PublicFooter = ({
    menus = [],
    language = "en",
    isArabic = false,
}) => {

    const currentYear =
        new Date().getFullYear();

    const visibleMenus =
        menus.filter((menu) => (
            menu.pages?.length > 0 ||
            menu.children?.some(
                (child) =>
                    child.pages?.length > 0
            )
        ));

    const latestPages =
        visibleMenus
            .flatMap((menu) => [
                ...(menu.pages ?? []),

                ...(menu.children ?? [])
                    .flatMap(
                        (child) =>
                            child.pages ?? []
                    ),
            ])
            .filter(
                (
                    page,
                    index,
                    allPages
                ) =>
                    allPages.findIndex(
                        (item) =>
                            item.id === page.id
                    ) === index
            )
            .slice(0, 6);

    const content = isArabic
        ? {
            subtitle:
                "مهندس برمجيات أول",

            description:
                "تجربة محتوى ديناميكية مدعومة بلارافيل ورياكت، صُممت لجعل المعلومات المنشورة واضحة ومنظمة وسهلة الاستكشاف.",

            explore:
                "استكشف",

            home:
                "الرئيسية",

            latestContent:
                "أحدث المحتويات",

            emptyContent:
                "سيظهر المحتوى المنشور هنا.",

            copyright:
                `© ${currentYear} إحسان سليم خان. جميع الحقوق محفوظة.`,

            powered:
                "مدعوم بواسطة Laravel وReact وMaterial UI",

            language:
                "العربية",
        }
        : {
            subtitle:
                "Senior Software Engineer",

            description:
                "A dynamic content experience powered by Laravel and React, designed to make published information clear, organized, and easy to explore.",

            explore:
                "Explore",

            home:
                "Home",

            latestContent:
                "Latest Content",

            emptyContent:
                "Published content will appear here.",

            copyright:
                `© ${currentYear} Ihsan Saleemkhan. All rights reserved.`,

            powered:
                "Powered by Laravel, React and Material UI",

            language:
                "English",
        };

    return (

        <Box
            component="footer"
            dir={
                isArabic
                    ? "rtl"
                    : "ltr"
            }
            sx={{
                mt: "auto",

                bgcolor:
                    "#0d1b2f",

                color:
                    "#fff",

                position:
                    "relative",

                overflow:
                    "hidden",

                fontFamily:
                    isArabic
                        ? "'Noto Sans Arabic', Tahoma, Arial, sans-serif"
                        : "inherit",
            }}
        >

            {/* Decorative glow */}

            <Box
                sx={{
                    position:
                        "absolute",

                    top: -180,

                    right: isArabic
                        ? "auto"
                        : -150,

                    left: isArabic
                        ? -150
                        : "auto",

                    width: 420,

                    height: 420,

                    borderRadius:
                        "50%",

                    bgcolor:
                        alpha(
                            "#42a5f5",
                            0.08
                        ),

                    pointerEvents:
                        "none",
                }}
            />

            <Box
                sx={{
                    position:
                        "absolute",

                    bottom: -220,

                    left: isArabic
                        ? "auto"
                        : -180,

                    right: isArabic
                        ? -180
                        : "auto",

                    width: 460,

                    height: 460,

                    borderRadius:
                        "50%",

                    border:
                        "1px solid",

                    borderColor:
                        alpha(
                            "#fff",
                            0.05
                        ),

                    pointerEvents:
                        "none",
                }}
            />

            <Container
                maxWidth="xl"
                sx={{
                    position:
                        "relative",

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
                        size={{
                            xs: 12,
                            md: 5,
                        }}
                    >

                        <Stack
                            direction={
                                isArabic
                                    ? "row-reverse"
                                    : "row"
                            }
                            spacing={1.5}
                            alignItems="center"
                        >

                            <Box
                                sx={{
                                    width: 48,

                                    height: 48,

                                    borderRadius:
                                        2.75,

                                    background:
                                        "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    boxShadow:
                                        "0 10px 26px rgba(25,118,210,0.3)",

                                    flexShrink: 0,
                                }}
                            >

                                <WebAssetIcon
                                    sx={{
                                        fontSize:
                                            26,

                                        color:
                                            "#fff",
                                    }}
                                />

                            </Box>

                            <Box
                                sx={{
                                    textAlign:
                                        isArabic
                                            ? "right"
                                            : "left",
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize:
                                            20,

                                        fontWeight:
                                            900,

                                        lineHeight:
                                            1.1,

                                        letterSpacing:
                                            isArabic
                                                ? 0
                                                : -0.4,
                                    }}
                                >
                                    Ihsan Saleemkhan
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.35,

                                        fontSize:
                                            10,

                                        fontWeight:
                                            800,

                                        letterSpacing:
                                            isArabic
                                                ? 0
                                                : 2,

                                        textTransform:
                                            isArabic
                                                ? "none"
                                                : "uppercase",

                                        color:
                                            "#90caf9",
                                    }}
                                >
                                    {content.subtitle}
                                </Typography>

                            </Box>

                        </Stack>

                        <Typography
                            sx={{
                                mt: 2.75,

                                maxWidth:
                                    500,

                                ml: isArabic
                                    ? "auto"
                                    : 0,

                                mr: isArabic
                                    ? 0
                                    : "auto",

                                color:
                                    alpha(
                                        "#fff",
                                        0.68
                                    ),

                                fontSize:
                                    14.5,

                                lineHeight:
                                    isArabic
                                        ? 2
                                        : 1.8,

                                textAlign:
                                    isArabic
                                        ? "right"
                                        : "left",
                            }}
                        >
                            {content.description}
                        </Typography>

                        <Stack
                            direction={
                                isArabic
                                    ? "row-reverse"
                                    : "row"
                            }
                            spacing={1}
                            sx={{
                                mt: 3,
                            }}
                        >

                            <FooterIconButton
                                href="#"
                                label="LinkedIn"
                            >
                                <LinkedInIcon fontSize="small" />
                            </FooterIconButton>

                            <FooterIconButton
                                href="#"
                                label="GitHub"
                            >
                                <GitHubIcon fontSize="small" />
                            </FooterIconButton>

                            <IconButton
                                aria-label={
                                    isArabic
                                        ? "اللغة العربية"
                                        : "English language"
                                }
                                sx={{
                                    color:
                                        alpha(
                                            "#fff",
                                            0.72
                                        ),

                                    bgcolor:
                                        alpha(
                                            "#fff",
                                            0.06
                                        ),

                                    border:
                                        "1px solid",

                                    borderColor:
                                        alpha(
                                            "#fff",
                                            0.08
                                        ),
                                }}
                            >
                                <LanguageIcon fontSize="small" />
                            </IconButton>

                        </Stack>

                    </Grid>

                    {/* Dynamic navigation */}

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >

                        <FooterHeading
                            isArabic={isArabic}
                        >
                            {content.explore}
                        </FooterHeading>

                        <Stack
                            spacing={1.25}
                            alignItems={
                                isArabic
                                    ? "flex-end"
                                    : "flex-start"
                            }
                        >

                            <FooterLink
                                label={
                                    content.home
                                }
                                to="/"
                                isArabic={
                                    isArabic
                                }
                            />

                            {visibleMenus
                                .slice(0, 6)
                                .map(
                                    (menu) => (

                                        <FooterLink
                                            key={
                                                menu.id
                                            }
                                            label={
                                                getLocalizedTitle(
                                                    menu,
                                                    language
                                                )
                                            }
                                            to={`/menu/${menu.slug}`}
                                            isArabic={
                                                isArabic
                                            }
                                        />

                                    )
                                )}

                        </Stack>

                    </Grid>

                    {/* Latest pages */}

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                        }}
                    >

                        <FooterHeading
                            isArabic={isArabic}
                        >
                            {content.latestContent}
                        </FooterHeading>

                        <Stack
                            spacing={1.25}
                            alignItems={
                                isArabic
                                    ? "flex-end"
                                    : "flex-start"
                            }
                        >

                            {latestPages.map(
                                (page) => (

                                    <FooterLink
                                        key={
                                            page.id
                                        }
                                        label={
                                            getLocalizedTitle(
                                                page,
                                                language
                                            )
                                        }
                                        to={`/page/${page.slug}`}
                                        isArabic={
                                            isArabic
                                        }
                                    />

                                )
                            )}

                            {latestPages.length ===
                                0 && (

                                <Typography
                                    sx={{
                                        color:
                                            alpha(
                                                "#fff",
                                                0.55
                                            ),

                                        fontSize:
                                            13.5,

                                        lineHeight:
                                            isArabic
                                                ? 1.9
                                                : 1.6,

                                        textAlign:
                                            isArabic
                                                ? "right"
                                                : "left",
                                    }}
                                >
                                    {content.emptyContent}
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

                        borderColor:
                            alpha(
                                "#fff",
                                0.08
                            ),
                    }}
                />

                {/* Bottom row */}

                <Stack
                    direction={{
                        xs: "column",

                        sm: isArabic
                            ? "row-reverse"
                            : "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: isArabic
                            ? "flex-end"
                            : "flex-start",

                        sm: "center",
                    }}
                    spacing={1.5}
                >

                    <Typography
                        sx={{
                            color:
                                alpha(
                                    "#fff",
                                    0.5
                                ),

                            fontSize:
                                12.5,

                            textAlign:
                                isArabic
                                    ? "right"
                                    : "left",
                        }}
                    >
                        {content.copyright}
                    </Typography>

                    <Typography
                        sx={{
                            color:
                                alpha(
                                    "#fff",
                                    0.46
                                ),

                            fontSize:
                                12.5,

                            textAlign:
                                isArabic
                                    ? "right"
                                    : "left",
                        }}
                    >
                        {content.powered}
                    </Typography>

                </Stack>

            </Container>

        </Box>

    );

};

const FooterHeading = ({
    children,
    isArabic = false,
}) => (

    <Typography
        sx={{
            mb: 2,

            fontSize:
                12,

            fontWeight:
                900,

            color:
                "#90caf9",

            textTransform:
                isArabic
                    ? "none"
                    : "uppercase",

            letterSpacing:
                isArabic
                    ? 0
                    : 1.6,

            textAlign:
                isArabic
                    ? "right"
                    : "left",
        }}
    >
        {children}
    </Typography>

);

const FooterIconButton = ({
    href,
    label,
    children,
}) => (

    <IconButton
        component="a"
        href={href}
        aria-label={label}
        target={
            href !== "#"
                ? "_blank"
                : undefined
        }
        rel={
            href !== "#"
                ? "noopener noreferrer"
                : undefined
        }
        sx={{
            color:
                alpha(
                    "#fff",
                    0.72
                ),

            bgcolor:
                alpha(
                    "#fff",
                    0.06
                ),

            border:
                "1px solid",

            borderColor:
                alpha(
                    "#fff",
                    0.08
                ),

            "&:hover": {
                bgcolor:
                    alpha(
                        "#42a5f5",
                        0.14
                    ),

                color:
                    "#90caf9",
            },
        }}
    >
        {children}
    </IconButton>

);

const FooterLink = ({
    label,
    to,
    isArabic = false,
}) => {

    const DirectionArrow =
        isArabic
            ? ArrowBackIcon
            : ArrowForwardIcon;

    return (

        <Box
            component={Link}
            to={to}
            sx={{
                display:
                    "inline-flex",

                alignItems:
                    "center",

                flexDirection:
                    isArabic
                        ? "row-reverse"
                        : "row",

                gap: 0.8,

                width:
                    "fit-content",

                color:
                    alpha(
                        "#fff",
                        0.68
                    ),

                textDecoration:
                    "none",

                fontSize:
                    13.5,

                fontWeight:
                    600,

                textAlign:
                    isArabic
                        ? "right"
                        : "left",

                transition:
                    "all 0.2s ease",

                "&:hover": {
                    color:
                        "#90caf9",

                    transform:
                        isArabic
                            ? "translateX(-4px)"
                            : "translateX(4px)",
                },

                "&:hover .footer-arrow": {
                    opacity: 1,

                    transform:
                        "translateX(0)",
                },
            }}
        >

            <DirectionArrow
                className="footer-arrow"
                sx={{
                    fontSize:
                        15,

                    opacity: 0,

                    transform:
                        isArabic
                            ? "translateX(4px)"
                            : "translateX(-4px)",

                    transition:
                        "all 0.2s ease",
                }}
            />

            {label}

        </Box>

    );

};

export default PublicFooter;