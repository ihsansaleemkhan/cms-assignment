import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Container,
    Grid,
    Skeleton,
    Stack,
    Typography,
    alpha,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

import {
    Link,
    useOutletContext,
} from "react-router-dom";

import { toast } from "react-toastify";

import HeroSection from "../../components/Public/HeroSection";
import PageCard from "../../components/Public/PageCard";

import {
    getPublicPages,
} from "../../services/publicService";

import {
    getLocalizedTitle,
} from "../../utils/localization";

const Home = () => {

    const {
        menus = [],
        language = "en",
        isArabic = false,
    } = useOutletContext();

    const [pages, setPages] = useState([]);

    const [totalPages, setTotalPages] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const content = isArabic
        ? {
            loadError:
                "تعذر تحميل الصفحات المنشورة.",

            latestEyebrow:
                "أحدث المحتويات",

            latestTitle:
                "الصفحات المنشورة المميزة",

            latestDescription:
                "استكشف أحدث الصفحات المنشورة والمحتوى المنظم من خلال القوائم الديناميكية.",

            categoryEyebrow:
                "تصفح حسب التصنيف",

            categoryTitle:
                "استكشف قوائم المحتوى",

            categoryDescription:
                "يتم إنشاء كل قسم تلقائياً من بنية القوائم التي تتم إدارتها في نظام إدارة المحتوى.",

            ctaEyebrow:
                "النشر الديناميكي",

            ctaTitle:
                "اكتشف محتوى منظماً ومحدثاً وسهل الوصول.",

            ctaDescription:
                "تصفح الصفحات من خلال قوائمنا الديناميكية واعرض المحتوى المنشور مباشرة من نظام إدارة المحتوى.",

            ctaButton:
                "ابدأ الاستكشاف",

            publishedPage:
                "صفحة منشورة",

            publishedPages:
                "صفحات منشورة",

            viewAll:
                "عرض الكل",

            noMenuPages:
                "لا توجد صفحات منشورة متاحة حالياً في هذه القائمة.",

            emptyTitle:
                "لا توجد صفحات منشورة",

            emptyDescription:
                "ستظهر الصفحات المنشورة والمستحقة هنا تلقائياً.",
        }
        : {
            loadError:
                "Unable to load published pages.",

            latestEyebrow:
                "Latest content",

            latestTitle:
                "Featured published pages",

            latestDescription:
                "Explore the most recently published pages and discover content organized through the dynamic menu.",

            categoryEyebrow:
                "Browse by category",

            categoryTitle:
                "Explore our content menus",

            categoryDescription:
                "Each section is generated from the menu structure managed in the CMS.",

            ctaEyebrow:
                "Dynamic publishing",

            ctaTitle:
                "Discover content that is organized, current and easy to access.",

            ctaDescription:
                "Browse pages through our dynamic menus and view content published directly from the CMS.",

            ctaButton:
                "Start Exploring",

            publishedPage:
                "published page",

            publishedPages:
                "published pages",

            viewAll:
                "View All",

            noMenuPages:
                "No published pages are currently available in this menu.",

            emptyTitle:
                "No published pages available",

            emptyDescription:
                "Published and due pages will appear here automatically.",
        };

    const loadPages = async () => {

        try {

            setLoading(true);

            const response =
                await getPublicPages({
                    page: 1,
                });

            setPages(
                response.data ?? []
            );

            setTotalPages(
                response.meta?.total ??
                response.data?.length ??
                0
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                content.loadError
            );

            setPages([]);

            setTotalPages(0);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPages();

    }, [language]);

    const featuredPage =
        pages[0] ?? null;

    const supportingPages =
        pages.slice(1, 7);

    const visibleMenus = useMemo(() => {

        return menus.filter((menu) => {

            const rootPages =
                menu.pages?.length ?? 0;

            const childPages =
                menu.children?.reduce(
                    (total, child) =>
                        total +
                        (
                            child.pages
                                ?.length ?? 0
                        ),
                    0
                ) ?? 0;

            return (
                rootPages +
                childPages >
                0
            );

        });

    }, [menus]);

    const menuCount =
        visibleMenus.reduce(
            (total, menu) =>
                total +
                1 +
                (
                    menu.children
                        ?.length ?? 0
                ),
            0
        );

    const DirectionArrow =
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

            <HeroSection
                featuredPage={
                    featuredPage
                }
                totalPages={
                    totalPages
                }
                totalMenus={
                    menuCount
                }
                language={
                    language
                }
                isArabic={
                    isArabic
                }
            />

            {/* Featured Content */}

            <Box
                component="section"
                id="featured-pages"
                sx={{
                    bgcolor:
                        "#f7f8fb",

                    py: {
                        xs: 7,
                        md: 10,
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

                    <SectionHeading
                        eyebrow={
                            content.latestEyebrow
                        }
                        title={
                            content.latestTitle
                        }
                        description={
                            content.latestDescription
                        }
                        isArabic={
                            isArabic
                        }
                    />

                    {loading ? (

                        <FeaturedSkeleton />

                    ) : pages.length === 0 ? (

                        <EmptyContent
                            title={
                                content.emptyTitle
                            }
                            description={
                                content.emptyDescription
                            }
                            isArabic={
                                isArabic
                            }
                        />

                    ) : (

                        <>

                            {featuredPage && (

                                <Box
                                    sx={{
                                        mt: 5,
                                    }}
                                >

                                    <PageCard
                                        page={
                                            featuredPage
                                        }
                                        featured
                                        language={
                                            language
                                        }
                                        isArabic={
                                            isArabic
                                        }
                                    />

                                </Box>

                            )}

                            {supportingPages.length >
                                0 && (

                                <Grid
                                    container
                                    spacing={3}
                                    sx={{
                                        mt: 1,
                                    }}
                                >

                                    {supportingPages.map(
                                        (
                                            page
                                        ) => (

                                            <Grid
                                                size={{
                                                    xs: 12,
                                                    sm: 6,
                                                    lg: 4,
                                                }}
                                                key={
                                                    page.id
                                                }
                                            >

                                                <PageCard
                                                    page={
                                                        page
                                                    }
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

                            )}

                        </>

                    )}

                </Container>

            </Box>

            {/* Dynamic Menu Sections */}

            {visibleMenus.length > 0 && (

                <Box
                    component="section"
                    sx={{
                        py: {
                            xs: 7,
                            md: 10,
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

                        <SectionHeading
                            eyebrow={
                                content.categoryEyebrow
                            }
                            title={
                                content.categoryTitle
                            }
                            description={
                                content.categoryDescription
                            }
                            isArabic={
                                isArabic
                            }
                        />

                        <Stack
                            spacing={{
                                xs: 6,
                                md: 8,
                            }}
                            sx={{
                                mt: 6,
                            }}
                        >

                            {visibleMenus.map(
                                (
                                    menu
                                ) => (

                                    <MenuContentSection
                                        key={
                                            menu.id
                                        }
                                        menu={
                                            menu
                                        }
                                        language={
                                            language
                                        }
                                        isArabic={
                                            isArabic
                                        }
                                        content={
                                            content
                                        }
                                    />

                                )
                            )}

                        </Stack>

                    </Container>

                </Box>

            )}

            {/* Call to Action */}

            <Box
                component="section"
                sx={{
                    px: 2,

                    pb: {
                        xs: 7,
                        md: 10,
                    },

                    bgcolor: "#fff",
                }}
            >

                <Container
                    maxWidth="xl"
                    sx={{
                        px: {
                            xs: 0,
                            sm: 1,
                        },
                    }}
                >

                    <Box
                        sx={{
                            position:
                                "relative",

                            overflow:
                                "hidden",

                            borderRadius: {
                                xs: 4,
                                md: 5,
                            },

                            px: {
                                xs: 3,
                                sm: 5,
                                md: 8,
                            },

                            py: {
                                xs: 6,
                                md: 8,
                            },

                            color: "#fff",

                            background:
                                "linear-gradient(135deg, #0f2f57 0%, #1565c0 55%, #42a5f5 100%)",

                            boxShadow:
                                "0 24px 60px rgba(21,101,192,0.2)",
                        }}
                    >

                        <Box
                            sx={{
                                position:
                                    "absolute",

                                width: 320,
                                height: 320,

                                borderRadius:
                                    "50%",

                                bgcolor:
                                    alpha(
                                        "#fff",
                                        0.07
                                    ),

                                top: -170,

                                right: isArabic
                                    ? "auto"
                                    : -80,

                                left: isArabic
                                    ? -80
                                    : "auto",
                            }}
                        />

                        <Box
                            sx={{
                                position:
                                    "relative",

                                maxWidth: 720,

                                ml: isArabic
                                    ? "auto"
                                    : 0,

                                mr: isArabic
                                    ? 0
                                    : "auto",

                                textAlign:
                                    isArabic
                                        ? "right"
                                        : "left",
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize:
                                        12,

                                    fontWeight:
                                        900,

                                    letterSpacing:
                                        isArabic
                                            ? 0
                                            : 2,

                                    textTransform:
                                        isArabic
                                            ? "none"
                                            : "uppercase",

                                    color:
                                        "#bbdefb",
                                }}
                            >
                                {
                                    content.ctaEyebrow
                                }
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1.5,

                                    fontSize: {
                                        xs: 30,
                                        sm: 38,
                                        md: 46,
                                    },

                                    lineHeight:
                                        isArabic
                                            ? 1.45
                                            : 1.1,

                                    fontWeight:
                                        900,

                                    letterSpacing:
                                        isArabic
                                            ? 0
                                            : -1,
                                }}
                            >
                                {
                                    content.ctaTitle
                                }
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2.5,

                                    maxWidth:
                                        620,

                                    fontSize: {
                                        xs: 15,
                                        md: 17,
                                    },

                                    lineHeight:
                                        isArabic
                                            ? 2
                                            : 1.75,

                                    color:
                                        alpha(
                                            "#fff",
                                            0.78
                                        ),
                                }}
                            >
                                {
                                    content.ctaDescription
                                }
                            </Typography>

                            {featuredPage && (

                                <Button
                                    component={
                                        Link
                                    }
                                    to={`/page/${featuredPage.slug}`}
                                    variant="contained"
                                    endIcon={
                                        <DirectionArrow />
                                    }
                                    sx={{
                                        mt: 4,
                                        px: 3.5,
                                        py: 1.4,

                                        borderRadius:
                                            2.5,

                                        textTransform:
                                            "none",

                                        fontWeight:
                                            800,

                                        bgcolor:
                                            "#fff",

                                        color:
                                            "#1565c0",

                                        boxShadow:
                                            "none",

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
                                                "#eaf3ff",

                                            boxShadow:
                                                "none",
                                        },
                                    }}
                                >
                                    {
                                        content.ctaButton
                                    }
                                </Button>

                            )}

                        </Box>

                    </Box>

                </Container>

            </Box>

        </Box>

    );

};

const MenuContentSection = ({
    menu,
    language = "en",
    isArabic = false,
    content,
}) => {

    const menuTitle =
        getLocalizedTitle(
            menu,
            language
        );

    const menuPages = [
        ...(menu.pages ?? []),

        ...(menu.children ?? [])
            .flatMap(
                (child) =>
                    (
                        child.pages ?? []
                    ).map(
                        (page) => ({
                            ...page,

                            menu:
                                page.menu ?? {
                                    id:
                                        child.id,

                                    title:
                                        child.title,

                                    title_ar:
                                        child.title_ar,

                                    slug:
                                        child.slug,
                                },
                        })
                    )
            ),
    ];

    const DirectionArrow =
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
                    pb: 2.5,

                    borderBottom:
                        "1px solid",

                    borderColor:
                        alpha(
                            "#14213d",
                            0.08
                        ),
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
                            width: 46,
                            height: 46,

                            borderRadius:
                                2.5,

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

                            flexShrink: 0,
                        }}
                    >
                        <MenuBookOutlinedIcon />
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
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: 24,
                                    md: 28,
                                },

                                fontWeight:
                                    900,

                                lineHeight:
                                    isArabic
                                        ? 1.5
                                        : 1.15,

                                color:
                                    "#10233f",

                                letterSpacing:
                                    isArabic
                                        ? 0
                                        : -0.5,
                            }}
                        >
                            {menuTitle}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,

                                fontSize:
                                    13.5,

                                color:
                                    "text.secondary",
                            }}
                        >
                            {menuPages.length}{" "}
                            {menuPages.length ===
                            1
                                ? content.publishedPage
                                : content.publishedPages}
                        </Typography>

                    </Box>

                </Stack>

                <Button
                    component={Link}
                    to={`/menu/${menu.slug}`}
                    endIcon={
                        <DirectionArrow />
                    }
                    sx={{
                        textTransform:
                            "none",

                        fontWeight:
                            800,

                        borderRadius:
                            2,

                        px: 2,

                        "& .MuiButton-endIcon":
                            {
                                ml: isArabic
                                    ? 0
                                    : 1,

                                mr: isArabic
                                    ? 1
                                    : 0,
                            },
                    }}
                >
                    {content.viewAll}
                </Button>

            </Stack>

            {menuPages.length > 0 ? (

                <Grid
                    container
                    spacing={3}
                    sx={{
                        mt: 1,
                    }}
                >

                    {menuPages
                        .slice(0, 3)
                        .map(
                            (
                                page
                            ) => (

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        lg: 4,
                                    }}
                                    key={`${menu.id}-${page.id}`}
                                >

                                    <PageCard
                                        page={{
                                            ...page,

                                            menu:
                                                page.menu ??
                                                {
                                                    id:
                                                        menu.id,

                                                    title:
                                                        menu.title,

                                                    title_ar:
                                                        menu.title_ar,

                                                    slug:
                                                        menu.slug,
                                                },
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

            ) : (

                <Alert
                    severity="info"
                    sx={{
                        mt: 3,

                        borderRadius:
                            2.5,

                        textAlign:
                            isArabic
                                ? "right"
                                : "left",
                    }}
                >
                    {
                        content.noMenuPages
                    }
                </Alert>

            )}

            {menu.children?.length >
                0 && (

                <Stack
                    direction={
                        isArabic
                            ? "row-reverse"
                            : "row"
                    }
                    flexWrap="wrap"
                    useFlexGap
                    spacing={1}
                    sx={{
                        mt: 3,
                    }}
                >

                    {menu.children.map(
                        (
                            child
                        ) => (

                            <Button
                                key={
                                    child.id
                                }
                                component={
                                    Link
                                }
                                to={`/menu/${child.slug}`}
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderRadius:
                                        20,

                                    textTransform:
                                        "none",

                                    fontWeight:
                                        700,

                                    px: 2,
                                }}
                            >
                                {getLocalizedTitle(
                                    child,
                                    language
                                )}
                            </Button>

                        )
                    )}

                </Stack>

            )}

        </Box>

    );

};

const SectionHeading = ({
    eyebrow,
    title,
    description,
    isArabic = false,
}) => (

    <Box
        dir={
            isArabic
                ? "rtl"
                : "ltr"
        }
        sx={{
            maxWidth: 760,

            ml: isArabic
                ? "auto"
                : 0,

            mr: isArabic
                ? 0
                : "auto",

            textAlign:
                isArabic
                    ? "right"
                    : "left",
        }}
    >

        <Typography
            sx={{
                fontSize: 11,

                fontWeight:
                    900,

                color:
                    "primary.main",

                textTransform:
                    isArabic
                        ? "none"
                        : "uppercase",

                letterSpacing:
                    isArabic
                        ? 0
                        : 2,
            }}
        >
            {eyebrow}
        </Typography>

        <Typography
            component="h2"
            sx={{
                mt: 1.25,

                fontSize: {
                    xs: 30,
                    sm: 38,
                    md: 44,
                },

                fontWeight:
                    900,

                lineHeight:
                    isArabic
                        ? 1.45
                        : 1.1,

                letterSpacing:
                    isArabic
                        ? 0
                        : -1,

                color:
                    "#10233f",
            }}
        >
            {title}
        </Typography>

        <Typography
            sx={{
                mt: 2,

                maxWidth: 680,

                ml: isArabic
                    ? "auto"
                    : 0,

                mr: isArabic
                    ? 0
                    : "auto",

                fontSize: {
                    xs: 15,
                    md: 16.5,
                },

                lineHeight:
                    isArabic
                        ? 2
                        : 1.75,

                color:
                    "text.secondary",
            }}
        >
            {description}
        </Typography>

    </Box>

);

const FeaturedSkeleton = () => (

    <Box sx={{ mt: 5 }}>

        <Skeleton
            variant="rounded"
            height={420}
            sx={{
                borderRadius:
                    4,
            }}
        />

        <Grid
            container
            spacing={3}
            sx={{
                mt: 1,
            }}
        >

            {[1, 2, 3].map(
                (
                    item
                ) => (

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                        key={
                            item
                        }
                    >

                        <Skeleton
                            variant="rounded"
                            height={360}
                            sx={{
                                borderRadius:
                                    4,
                            }}
                        />

                    </Grid>

                )
            )}

        </Grid>

    </Box>

);

const EmptyContent = ({
    title,
    description,
    isArabic = false,
}) => (

    <Box
        sx={{
            mt: 5,
            py: 8,
            px: 3,

            textAlign:
                "center",

            borderRadius:
                4,

            border:
                "1px dashed",

            borderColor:
                alpha(
                    "#14213d",
                    0.14
                ),

            bgcolor:
                "#fff",
        }}
    >

        <DescriptionOutlinedIcon
            sx={{
                fontSize:
                    58,

                color:
                    "text.disabled",
            }}
        />

        <Typography
            sx={{
                mt: 2,

                fontSize:
                    20,

                fontWeight:
                    800,

                color:
                    "#10233f",

                lineHeight:
                    isArabic
                        ? 1.6
                        : 1.3,
            }}
        >
            {title}
        </Typography>

        <Typography
            sx={{
                mt: 1,

                color:
                    "text.secondary",

                lineHeight:
                    isArabic
                        ? 1.9
                        : 1.6,
            }}
        >
            {description}
        </Typography>

    </Box>

);

export default Home;