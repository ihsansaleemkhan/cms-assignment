import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Container,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Typography,
    alpha,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

import {
    Link,
    useNavigate,
    useOutletContext,
    useParams,
} from "react-router-dom";

import { toast } from "react-toastify";
import DOMPurify from "dompurify";

import PageCard from "../../components/Public/PageCard";

import {
    getPublicPageBySlug,
} from "../../services/publicService";

import {
    getLocalizedBody,
    getLocalizedTitle,
} from "../../utils/localization";

const formatDate = (
    value,
    language = "en"
) => {

    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toLocaleDateString(
        language === "ar"
            ? "ar-QA"
            : "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );

};

const PageDetail = () => {

    const { slug } = useParams();

    const {
        menus = [],
        language = "en",
        isArabic = false,
    } = useOutletContext();

    const [page, setPage] = useState(null);

    const [loading, setLoading] = useState(true);

    const [notFound, setNotFound] = useState(false);

    const content = isArabic
        ? {
            home: "الرئيسية",

            loadError:
                "تعذر تحميل الصفحة.",

            publishedFrom:
                "محتوى منشور من قسم",

            website:
                "الموقع",

            backTo:
                "العودة إلى",

            readContent:
                "قراءة المحتوى",

            pageContent:
                "محتوى الصفحة",

            publishedCms:
                "منشور من نظام إدارة المحتوى",

            continueExploring:
                "تابع الاستكشاف",

            relatedPages:
                "صفحات ذات صلة",

            viewAll:
                "عرض جميع صفحات",

            notFound:
                "الصفحة غير موجودة",

            notFoundDescription:
                "الصفحة المطلوبة غير موجودة، أو لم يتم نشرها، أو تم تحديد موعد نشرها في المستقبل.",

            goBack:
                "العودة",

            returnHome:
                "العودة إلى الرئيسية",
        }
        : {
            home: "Home",

            loadError:
                "Unable to load page.",

            publishedFrom:
                "Published content from the",

            website:
                "website",

            backTo:
                "Back to",

            readContent:
                "Read Content",

            pageContent:
                "Page Content",

            publishedCms:
                "Published from the CMS",

            continueExploring:
                "Continue exploring",

            relatedPages:
                "Related Pages",

            viewAll:
                "View All",

            notFound:
                "Page not found",

            notFoundDescription:
                "The requested page does not exist, has not been published, or is scheduled for a future date.",

            goBack:
                "Go Back",

            returnHome:
                "Return Home",
        };

    const loadPage = async () => {

        try {

            setLoading(true);

            setNotFound(false);

            const response =
                await getPublicPageBySlug(slug);

            setPage(
                response.data ?? null
            );

        } catch (error) {

            if (
                error.response?.status === 404
            ) {

                setNotFound(true);

                setPage(null);

                return;

            }

            toast.error(
                error.response?.data?.message ??
                content.loadError
            );

            setPage(null);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPage();

    }, [slug]);

    const menuMatch = useMemo(() => {

        if (!page?.menu?.id) {
            return null;
        }

        for (const rootMenu of menus) {

            if (
                rootMenu.id ===
                page.menu.id
            ) {

                return {
                    menu: rootMenu,
                    parent: null,
                };

            }

            const childMenu =
                rootMenu.children?.find(
                    (child) =>
                        child.id ===
                        page.menu.id
                );

            if (childMenu) {

                return {
                    menu: childMenu,
                    parent: rootMenu,
                };

            }

        }

        return {
            menu: page.menu,
            parent: null,
        };

    }, [
        menus,
        page,
    ]);

    const relatedPages = useMemo(() => {

        if (!page?.menu?.id) {
            return [];
        }

        for (const rootMenu of menus) {

            if (
                rootMenu.id ===
                page.menu.id
            ) {

                return (
                    rootMenu.pages ?? []
                )
                    .filter(
                        (relatedPage) =>
                            relatedPage.id !==
                            page.id
                    )
                    .slice(0, 3);

            }

            const childMenu =
                rootMenu.children?.find(
                    (child) =>
                        child.id ===
                        page.menu.id
                );

            if (childMenu) {

                return (
                    childMenu.pages ?? []
                )
                    .filter(
                        (relatedPage) =>
                            relatedPage.id !==
                            page.id
                    )
                    .slice(0, 3);

            }

        }

        return [];

    }, [
        menus,
        page,
    ]);

    if (loading) {

        return (
            <PageDetailSkeleton />
        );

    }

    if (
        notFound ||
        !page
    ) {

        return (
            <PageNotFound
                content={content}
                isArabic={isArabic}
            />
        );

    }

    const pageTitle =
        getLocalizedTitle(
            page,
            language
        );

    const pageBody =
        getLocalizedBody(
            page,
            language
        );

    const pageMenuTitle =
        getLocalizedTitle(
            page.menu,
            language
        );

    const matchedMenuTitle =
        getLocalizedTitle(
            menuMatch?.menu,
            language
        );

    const parentMenuTitle =
        getLocalizedTitle(
            menuMatch?.parent,
            language
        );

    const publishedDate =
        formatDate(
            page.publish_date,
            language
        );

    const sanitizedBody =
        DOMPurify.sanitize(
            pageBody ?? ""
        );

    const BackArrow =
        isArabic
            ? ArrowForwardIcon
            : ArrowBackIcon;

    const ForwardArrow =
        isArabic
            ? ArrowBackIcon
            : ArrowForwardIcon;

    return (

        <Box
            dir={
                isArabic
                    ? "rtl"
                    : "ltr"
            }
        >

            {/* Page header */}

            <Box
                component="section"
                sx={{
                    position: "relative",

                    overflow: "hidden",

                    bgcolor: "#eef5ff",

                    backgroundImage: `
                        radial-gradient(
                            circle at ${
                                isArabic
                                    ? "12% 15%"
                                    : "88% 15%"
                            },
                            rgba(66,165,245,0.18),
                            transparent 30%
                        ),
                        linear-gradient(
                            135deg,
                            #f8fbff 0%,
                            #eef5ff 100%
                        )
                    `,

                    borderBottom:
                        "1px solid",

                    borderColor:
                        alpha(
                            "#14213d",
                            0.07
                        ),
                }}
            >

                <Container
                    maxWidth="xl"
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },

                        py: {
                            xs: 5,
                            md: 7,
                        },
                    }}
                >

                    <Breadcrumbs
                        aria-label={
                            isArabic
                                ? "مسار التنقل"
                                : "breadcrumb"
                        }
                        separator={
                            isArabic
                                ? "‹"
                                : "›"
                        }
                        sx={{
                            mb: 3,

                            "& .MuiBreadcrumbs-ol": {
                                flexDirection:
                                    isArabic
                                        ? "row-reverse"
                                        : "row",

                                justifyContent:
                                    isArabic
                                        ? "flex-end"
                                        : "flex-start",
                            },

                            "& .MuiBreadcrumbs-separator": {
                                color:
                                    "text.disabled",

                                mx: 0.75,
                            },
                        }}
                    >

                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display:
                                    "inline-flex",

                                alignItems:
                                    "center",

                                flexDirection:
                                    isArabic
                                        ? "row-reverse"
                                        : "row",

                                gap: 0.5,

                                color:
                                    "text.secondary",

                                textDecoration:
                                    "none",

                                fontSize: 13,

                                fontWeight:
                                    700,

                                "&:hover": {
                                    color:
                                        "primary.main",
                                },
                            }}
                        >

                            <HomeOutlinedIcon
                                sx={{
                                    fontSize: 17,
                                }}
                            />

                            {content.home}

                        </Box>

                        {menuMatch?.parent && (

                            <Box
                                component={Link}
                                to={`/menu/${menuMatch.parent.slug}`}
                                sx={{
                                    color:
                                        "text.secondary",

                                    textDecoration:
                                        "none",

                                    fontSize: 13,

                                    fontWeight:
                                        700,

                                    "&:hover": {
                                        color:
                                            "primary.main",
                                    },
                                }}
                            >
                                {parentMenuTitle}
                            </Box>

                        )}

                        {menuMatch?.menu && (

                            <Box
                                component={Link}
                                to={`/menu/${menuMatch.menu.slug}`}
                                sx={{
                                    color:
                                        "text.secondary",

                                    textDecoration:
                                        "none",

                                    fontSize: 13,

                                    fontWeight:
                                        700,

                                    "&:hover": {
                                        color:
                                            "primary.main",
                                    },
                                }}
                            >
                                {matchedMenuTitle}
                            </Box>

                        )}

                        <Typography
                            sx={{
                                color:
                                    "text.primary",

                                fontSize: 13,

                                fontWeight:
                                    800,

                                maxWidth: 260,

                                whiteSpace:
                                    "nowrap",

                                overflow:
                                    "hidden",

                                textOverflow:
                                    "ellipsis",
                            }}
                        >
                            {pageTitle}
                        </Typography>

                    </Breadcrumbs>

                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "1fr",

                                lg: isArabic
                                    ? "minmax(440px, 1.05fr) minmax(0, 0.95fr)"
                                    : "minmax(0, 0.95fr) minmax(440px, 1.05fr)",
                            },

                            gap: {
                                xs: 4,
                                lg: 7,
                            },

                            alignItems:
                                "center",
                        }}
                    >

                        {/* Text */}

                        <Box
                            sx={{
                                order: {
                                    xs: 1,

                                    lg: isArabic
                                        ? 2
                                        : 1,
                                },

                                textAlign:
                                    isArabic
                                        ? "right"
                                        : "left",
                            }}
                        >

                            <Stack
                                direction={
                                    isArabic
                                        ? "row-reverse"
                                        : "row"
                                }
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{
                                    mb: 2,
                                }}
                            >

                                {pageMenuTitle && (

                                    <Chip
                                        icon={
                                            <MenuBookOutlinedIcon
                                                sx={{
                                                    fontSize:
                                                        17,
                                                }}
                                            />
                                        }
                                        label={
                                            pageMenuTitle
                                        }
                                        sx={{
                                            bgcolor:
                                                alpha(
                                                    "#1976d2",
                                                    0.09
                                                ),

                                            color:
                                                "primary.main",

                                            fontWeight:
                                                800,

                                            border:
                                                "1px solid",

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

                                )}

                                {publishedDate && (

                                    <Chip
                                        icon={
                                            <CalendarTodayOutlinedIcon
                                                sx={{
                                                    fontSize:
                                                        16,
                                                }}
                                            />
                                        }
                                        label={
                                            publishedDate
                                        }
                                        variant="outlined"
                                        sx={{
                                            bgcolor:
                                                alpha(
                                                    "#fff",
                                                    0.72
                                                ),

                                            color:
                                                "text.secondary",

                                            fontWeight:
                                                700,

                                            borderColor:
                                                alpha(
                                                    "#14213d",
                                                    0.1
                                                ),
                                        }}
                                    />

                                )}

                            </Stack>

                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: {
                                        xs: 38,
                                        sm: 48,
                                        md: 58,
                                    },

                                    lineHeight:
                                        isArabic
                                            ? 1.35
                                            : 1.04,

                                    letterSpacing:
                                        isArabic
                                            ? 0
                                            : -1.7,

                                    fontWeight:
                                        900,

                                    color:
                                        "#10233f",
                                }}
                            >
                                {pageTitle}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2.5,

                                    maxWidth: 680,

                                    ml: isArabic
                                        ? "auto"
                                        : 0,

                                    mr: isArabic
                                        ? 0
                                        : "auto",

                                    fontSize: {
                                        xs: 15,
                                        md: 17,
                                    },

                                    lineHeight:
                                        isArabic
                                            ? 2
                                            : 1.75,

                                    color:
                                        "text.secondary",
                                }}
                            >
                                {isArabic
                                    ? `${content.publishedFrom} ${
                                        pageMenuTitle ||
                                        content.website
                                    }.`
                                    : `${content.publishedFrom} ${
                                        pageMenuTitle ||
                                        content.website
                                    } section.`}
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
                                }}
                            >

                                <Button
                                    component={Link}
                                    to={
                                        page.menu?.slug
                                            ? `/menu/${page.menu.slug}`
                                            : "/"
                                    }
                                    variant="contained"
                                    startIcon={
                                        <BackArrow />
                                    }
                                    sx={{
                                        px: 3,
                                        py: 1.25,

                                        borderRadius:
                                            2.5,

                                        textTransform:
                                            "none",

                                        fontWeight:
                                            800,

                                        "& .MuiButton-startIcon": {
                                            ml: isArabic
                                                ? 1
                                                : -0.5,

                                            mr: isArabic
                                                ? -0.5
                                                : 1,
                                        },
                                    }}
                                >
                                    {content.backTo}{" "}
                                    {pageMenuTitle ||
                                        content.home}
                                </Button>

                                <Button
                                    component="a"
                                    href="#page-content"
                                    variant="outlined"
                                    endIcon={
                                        <ForwardArrow />
                                    }
                                    sx={{
                                        px: 3,
                                        py: 1.2,

                                        borderRadius:
                                            2.5,

                                        textTransform:
                                            "none",

                                        fontWeight:
                                            800,

                                        color:
                                            "#10233f",

                                        borderColor:
                                            alpha(
                                                "#10233f",
                                                0.15
                                            ),

                                        "& .MuiButton-endIcon": {
                                            ml: isArabic
                                                ? 0
                                                : 1,

                                            mr: isArabic
                                                ? 1
                                                : 0,
                                        },

                                        "&:hover": {
                                            color:
                                                "primary.main",

                                            borderColor:
                                                "primary.main",
                                        },
                                    }}
                                >
                                    {content.readContent}
                                </Button>

                            </Stack>

                        </Box>

                        {/* Cover image */}

                        <Box
                            sx={{
                                order: {
                                    xs: 2,

                                    lg: isArabic
                                        ? 1
                                        : 2,
                                },

                                position:
                                    "relative",

                                width: "100%",
                            }}
                        >

                            <Box
                                sx={{
                                    position:
                                        "absolute",

                                    inset: isArabic
                                        ? "22px 24px -16px -14px"
                                        : "22px -14px -16px 24px",

                                    borderRadius:
                                        5,

                                    bgcolor:
                                        alpha(
                                            "#1976d2",
                                            0.1
                                        ),

                                    transform:
                                        isArabic
                                            ? "rotate(-2.5deg)"
                                            : "rotate(2.5deg)",
                                }}
                            />

                            <Box
                                sx={{
                                    position:
                                        "relative",

                                    minHeight: {
                                        xs: 310,
                                        sm: 420,
                                        lg: 470,
                                    },

                                    borderRadius: {
                                        xs: 4,
                                        md: 5,
                                    },

                                    overflow:
                                        "hidden",

                                    bgcolor:
                                        "#1565c0",

                                    boxShadow:
                                        "0 24px 64px rgba(15,35,63,0.2)",
                                }}
                            >

                                {page.cover_image ? (

                                    <Box
                                        component="img"
                                        src={
                                            page.cover_image
                                        }
                                        alt={
                                            pageTitle
                                        }
                                        sx={{
                                            position:
                                                "absolute",

                                            inset: 0,

                                            width:
                                                "100%",

                                            height:
                                                "100%",

                                            objectFit:
                                                "cover",
                                        }}
                                    />

                                ) : (

                                    <Box
                                        sx={{
                                            position:
                                                "absolute",

                                            inset: 0,

                                            display:
                                                "flex",

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
                                                fontSize:
                                                    110,

                                                color:
                                                    alpha(
                                                        "#fff",
                                                        0.8
                                                    ),
                                            }}
                                        />
                                    </Box>

                                )}

                                <Box
                                    sx={{
                                        position:
                                            "absolute",

                                        inset: 0,

                                        background:
                                            "linear-gradient(180deg, rgba(16,35,63,0.02) 45%, rgba(16,35,63,0.32) 100%)",
                                    }}
                                />

                            </Box>

                        </Box>

                    </Box>

                </Container>

            </Box>

            {/* Main body */}

            <Box
                id="page-content"
                component="section"
                sx={{
                    py: {
                        xs: 6,
                        md: 9,
                    },

                    bgcolor:
                        "#f7f8fb",
                }}
            >

                <Container
                    maxWidth="lg"
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >

                    <Box
                        component="article"
                        dir={
                            isArabic
                                ? "rtl"
                                : "ltr"
                        }
                        sx={{
                            bgcolor:
                                "#fff",

                            borderRadius: {
                                xs: 3,
                                md: 4,
                            },

                            border:
                                "1px solid",

                            borderColor:
                                alpha(
                                    "#14213d",
                                    0.08
                                ),

                            boxShadow:
                                "0 14px 40px rgba(15,23,42,0.06)",

                            px: {
                                xs: 2.5,
                                sm: 4,
                                md: 7,
                            },

                            py: {
                                xs: 4,
                                md: 6,
                            },
                        }}
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
                                mb: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,

                                    borderRadius:
                                        2,

                                    bgcolor:
                                        alpha(
                                            "#1976d2",
                                            0.08
                                        ),

                                    color:
                                        "primary.main",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",
                                }}
                            >
                                <DescriptionOutlinedIcon />
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
                                            11,

                                        fontWeight:
                                            900,

                                        color:
                                            "primary.main",

                                        letterSpacing:
                                            isArabic
                                                ? 0
                                                : 1.6,

                                        textTransform:
                                            isArabic
                                                ? "none"
                                                : "uppercase",
                                    }}
                                >
                                    {content.pageContent}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.2,

                                        fontSize:
                                            13,

                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {content.publishedCms}
                                </Typography>

                            </Box>

                        </Stack>

                        <Divider
                            sx={{
                                mb: 4,
                            }}
                        />

                        <Box
                            className="public-page-content"
                            dangerouslySetInnerHTML={{
                                __html:
                                    sanitizedBody,
                            }}
                            sx={{
                                direction:
                                    isArabic
                                        ? "rtl"
                                        : "ltr",

                                textAlign:
                                    isArabic
                                        ? "right"
                                        : "left",

                                color:
                                    "#293548",

                                fontSize: {
                                    xs: 15.5,
                                    md: 17,
                                },

                                lineHeight:
                                    isArabic
                                        ? 2
                                        : 1.85,

                                overflowWrap:
                                    "anywhere",

                                fontFamily:
                                    isArabic
                                        ? "'Noto Sans Arabic', Tahoma, Arial, sans-serif"
                                        : "inherit",

                                "& > *:first-of-type": {
                                    mt: 0,
                                },

                                "& > *:last-child": {
                                    mb: 0,
                                },

                                "& h1, & h2, & h3, & h4, & h5, & h6": {
                                    color:
                                        "#10233f",

                                    fontWeight:
                                        900,

                                    lineHeight:
                                        isArabic
                                            ? 1.55
                                            : 1.2,

                                    letterSpacing:
                                        isArabic
                                            ? 0
                                            : -0.4,

                                    mt: 4,

                                    mb: 1.5,
                                },

                                "& h1": {
                                    fontSize: {
                                        xs: 30,
                                        md: 38,
                                    },
                                },

                                "& h2": {
                                    fontSize: {
                                        xs: 26,
                                        md: 32,
                                    },
                                },

                                "& h3": {
                                    fontSize: {
                                        xs: 22,
                                        md: 27,
                                    },
                                },

                                "& p": {
                                    mb: 2,
                                },

                                "& a": {
                                    color:
                                        "primary.main",

                                    fontWeight:
                                        700,
                                },

                                "& img": {
                                    display:
                                        "block",

                                    maxWidth:
                                        "100%",

                                    height:
                                        "auto",

                                    borderRadius:
                                        3,

                                    my: 3,

                                    boxShadow:
                                        "0 12px 28px rgba(15,23,42,0.1)",
                                },

                                "& figure": {
                                    maxWidth:
                                        "100%",

                                    my: 3,

                                    mx: 0,
                                },

                                "& figcaption": {
                                    mt: 1,

                                    color:
                                        "text.secondary",

                                    fontSize:
                                        13,

                                    textAlign:
                                        "center",
                                },

                                "& blockquote": {
                                    my: 3,

                                    mx: 0,

                                    py: 1.5,

                                    pl: isArabic
                                        ? 2
                                        : 2.5,

                                    pr: isArabic
                                        ? 2.5
                                        : 2,

                                    borderLeft:
                                        isArabic
                                            ? "none"
                                            : "4px solid",

                                    borderRight:
                                        isArabic
                                            ? "4px solid"
                                            : "none",

                                    borderColor:
                                        "primary.main",

                                    bgcolor:
                                        alpha(
                                            "#1976d2",
                                            0.05
                                        ),

                                    borderRadius:
                                        isArabic
                                            ? "12px 0 0 12px"
                                            : "0 12px 12px 0",

                                    color:
                                        "#42516a",

                                    fontStyle:
                                        "italic",
                                },

                                "& ul, & ol": {
                                    pl: isArabic
                                        ? 0
                                        : 3,

                                    pr: isArabic
                                        ? 3
                                        : 0,

                                    mb: 2,
                                },

                                "& li": {
                                    mb: 0.75,
                                },

                                "& table": {
                                    width:
                                        "100%",

                                    borderCollapse:
                                        "collapse",

                                    my: 3,
                                },

                                "& th, & td": {
                                    border:
                                        "1px solid #dfe4ea",

                                    px: 2,

                                    py: 1.25,

                                    textAlign:
                                        isArabic
                                            ? "right"
                                            : "left",
                                },

                                "& th": {
                                    bgcolor:
                                        "#f4f7fb",

                                    color:
                                        "#10233f",

                                    fontWeight:
                                        800,
                                },

                                "& .table": {
                                    width:
                                        "100%",

                                    overflowX:
                                        "auto",
                                },
                            }}
                        />

                    </Box>

                </Container>

            </Box>

            {/* Related pages */}

            {relatedPages.length > 0 && (

                <Box
                    component="section"
                    sx={{
                        py: {
                            xs: 7,
                            md: 9,
                        },

                        bgcolor:
                            "#fff",
                    }}
                >

                    <Container
                        maxWidth="xl"
                        sx={{
                            px: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                            },
                        }}
                    >

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

                                sm: "flex-end",
                            }}
                            spacing={2}
                            sx={{
                                mb: 4,
                            }}
                        >

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
                                            11,

                                        fontWeight:
                                            900,

                                        color:
                                            "primary.main",

                                        letterSpacing:
                                            isArabic
                                                ? 0
                                                : 1.8,

                                        textTransform:
                                            isArabic
                                                ? "none"
                                                : "uppercase",
                                    }}
                                >
                                    {content.continueExploring}
                                </Typography>

                                <Typography
                                    component="h2"
                                    sx={{
                                        mt: 1,

                                        fontSize: {
                                            xs: 30,
                                            md: 40,
                                        },

                                        fontWeight:
                                            900,

                                        color:
                                            "#10233f",

                                        letterSpacing:
                                            isArabic
                                                ? 0
                                                : -0.8,

                                        lineHeight:
                                            isArabic
                                                ? 1.5
                                                : 1.2,
                                    }}
                                >
                                    {content.relatedPages}
                                </Typography>

                            </Box>

                            {page.menu?.slug && (

                                <Button
                                    component={Link}
                                    to={`/menu/${page.menu.slug}`}
                                    endIcon={
                                        <ForwardArrow />
                                    }
                                    sx={{
                                        textTransform:
                                            "none",

                                        fontWeight:
                                            800,

                                        "& .MuiButton-endIcon": {
                                            ml: isArabic
                                                ? 0
                                                : 1,

                                            mr: isArabic
                                                ? 1
                                                : 0,
                                        },
                                    }}
                                >
                                    {content.viewAll}{" "}
                                    {pageMenuTitle}
                                </Button>

                            )}

                        </Stack>

                        <Grid
                            container
                            spacing={3}
                        >

                            {relatedPages.map(
                                (
                                    relatedPage
                                ) => (

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            lg: 4,
                                        }}
                                        key={
                                            relatedPage.id
                                        }
                                    >

                                        <PageCard
                                            page={{
                                                ...relatedPage,

                                                menu:
                                                    relatedPage.menu ??
                                                    page.menu,
                                            }}
                                            language={
                                                language
                                            }
                                            isArabic={
                                                isArabic
                                            }
                                        />

                                    </Grid>

                                )
                            )}

                        </Grid>

                    </Container>

                </Box>

            )}

        </Box>

    );

};

const PageDetailSkeleton = () => (

    <Box>

        <Box
            sx={{
                bgcolor:
                    "#eef5ff",

                py: {
                    xs: 5,
                    md: 7,
                },
            }}
        >

            <Container
                maxWidth="xl"
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >

                <Skeleton
                    width={250}
                    height={24}
                />

                <Grid
                    container
                    spacing={5}
                    alignItems="center"
                    sx={{
                        mt: 1,
                    }}
                >

                    <Grid
                        size={{
                            xs: 12,
                            lg: 6,
                        }}
                    >

                        <Skeleton
                            width={130}
                            height={36}
                            sx={{
                                borderRadius:
                                    20,
                            }}
                        />

                        <Skeleton
                            height={72}
                            sx={{
                                mt: 2,

                                maxWidth:
                                    650,
                            }}
                        />

                        <Skeleton
                            height={72}
                            sx={{
                                maxWidth:
                                    560,
                            }}
                        />

                        <Skeleton
                            width="72%"
                            height={28}
                            sx={{
                                mt: 2,
                            }}
                        />

                        <Skeleton
                            width={240}
                            height={52}
                            sx={{
                                mt: 3,

                                borderRadius:
                                    2.5,
                            }}
                        />

                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            lg: 6,
                        }}
                    >

                        <Skeleton
                            variant="rounded"
                            height={430}
                            sx={{
                                borderRadius:
                                    5,
                            }}
                        />

                    </Grid>

                </Grid>

            </Container>

        </Box>

        <Container
            maxWidth="lg"
            sx={{
                py: 8,

                px: {
                    xs: 2,
                    sm: 3,
                },
            }}
        >

            <Skeleton
                variant="rounded"
                height={520}
                sx={{
                    borderRadius:
                        4,
                }}
            />

        </Container>

    </Box>

);

const PageNotFound = ({
    content,
    isArabic = false,
}) => {

    const navigate =
        useNavigate();

    const BackArrow =
        isArabic
            ? ArrowForwardIcon
            : ArrowBackIcon;

    return (

        <Box
            dir={
                isArabic
                    ? "rtl"
                    : "ltr"
            }
            sx={{
                minHeight:
                    "72vh",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                px: 3,

                py: 6,

                bgcolor:
                    "#f7f8fb",
            }}
        >

            <Box
                sx={{
                    maxWidth:
                        580,

                    textAlign:
                        "center",
                }}
            >

                <DescriptionOutlinedIcon
                    sx={{
                        fontSize:
                            78,

                        color:
                            "text.disabled",
                    }}
                />

                <Typography
                    sx={{
                        mt: 2,

                        fontSize: {
                            xs: 31,
                            md: 42,
                        },

                        fontWeight:
                            900,

                        color:
                            "#10233f",

                        letterSpacing:
                            isArabic
                                ? 0
                                : -0.8,

                        lineHeight:
                            isArabic
                                ? 1.5
                                : 1.2,
                    }}
                >
                    {content.notFound}
                </Typography>

                <Typography
                    sx={{
                        mt: 1.5,

                        color:
                            "text.secondary",

                        lineHeight:
                            isArabic
                                ? 1.9
                                : 1.75,
                    }}
                >
                    {content.notFoundDescription}
                </Typography>

                <Stack
                    direction={{
                        xs: "column",

                        sm: isArabic
                            ? "row-reverse"
                            : "row",
                    }}
                    justifyContent="center"
                    spacing={1.5}
                    sx={{
                        mt: 3.5,
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <BackArrow />
                        }
                        onClick={() =>
                            navigate(-1)
                        }
                        sx={{
                            px: 3,
                            py: 1.15,

                            borderRadius:
                                2.5,

                            textTransform:
                                "none",

                            fontWeight:
                                800,

                            "& .MuiButton-startIcon": {
                                ml: isArabic
                                    ? 1
                                    : -0.5,

                                mr: isArabic
                                    ? -0.5
                                    : 1,
                            },
                        }}
                    >
                        {content.goBack}
                    </Button>

                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        sx={{
                            px: 3,
                            py: 1.2,

                            borderRadius:
                                2.5,

                            textTransform:
                                "none",

                            fontWeight:
                                800,
                        }}
                    >
                        {content.returnHome}
                    </Button>

                </Stack>

            </Box>

        </Box>

    );

};

export default PageDetail;