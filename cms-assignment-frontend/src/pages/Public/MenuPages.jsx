import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Container,
    Grid,
    InputAdornment,
    Pagination,
    Skeleton,
    Stack,
    TextField,
    Typography,
    alpha,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SearchIcon from "@mui/icons-material/Search";

import {
    Link,
    useOutletContext,
    useParams,
} from "react-router-dom";

import { toast } from "react-toastify";

import PageCard from "../../components/Public/PageCard";

import {
    getPublicPages,
} from "../../services/publicService";

import {
    getLocalizedTitle,
} from "../../utils/localization";

const MenuPages = () => {

    const { slug } = useParams();

    const {
        menus = [],
        language = "en",
        isArabic = false,
    } = useOutletContext();

    const [pages, setPages] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [totalRows, setTotalRows] = useState(0);

    const content = isArabic
        ? {
            home: "الرئيسية",
            submenu: "قائمة فرعية",
            contentMenu: "قائمة محتوى",

            description:
                "تصفح جميع الصفحات المنشورة المتاحة ضمن هذه القائمة. يتم تحميل المحتوى مباشرة من نظام إدارة المحتوى، ولا يظهر إلا بعد نشره وحلول موعد عرضه.",

            publishedPage: "صفحة منشورة",
            publishedPages: "صفحات منشورة",

            exploreSubmenus: "استكشف القوائم الفرعية",

            sectionTitle: "المحتوى المنشور",

            sectionDescriptionPrefix:
                "تصفح أو ابحث في صفحات",

            searchPlaceholder:
                "ابحث في الصفحات...",

            loadError:
                "تعذر تحميل صفحات القائمة.",

            noMatchingTitle:
                "لم يتم العثور على صفحات مطابقة",

            noPublishedPrefix:
                "لا توجد صفحات منشورة في",

            tryAnotherSearch:
                "جرّب استخدام عبارة بحث أخرى.",

            automaticMessage:
                "ستظهر الصفحات المنشورة والمستحقة هنا تلقائياً.",

            menuNotFound:
                "القائمة غير موجودة",

            menuNotFoundDescription:
                "القائمة المطلوبة غير موجودة أو لم تعد متاحة للعامة.",

            backHome:
                "العودة إلى الرئيسية",
        }
        : {
            home: "Home",
            submenu: "Submenu",
            contentMenu: "Content Menu",

            description:
                "Browse all published pages available under this menu. Content is loaded directly from the CMS and only visible once it has been published and is due.",

            publishedPage: "Published Page",
            publishedPages: "Published Pages",

            exploreSubmenus: "Explore submenus",

            sectionTitle: "Published Content",

            sectionDescriptionPrefix:
                "Browse or search pages in",

            searchPlaceholder:
                "Search pages...",

            loadError:
                "Unable to load menu pages.",

            noMatchingTitle:
                "No matching pages found",

            noPublishedPrefix:
                "No published pages in",

            tryAnotherSearch:
                "Try another search term.",

            automaticMessage:
                "Published and due pages will appear here automatically.",

            menuNotFound:
                "Menu not found",

            menuNotFoundDescription:
                "The requested menu does not exist or is no longer publicly available.",

            backHome:
                "Back to Home",
        };

    const menuMatch = useMemo(() => {

        for (const rootMenu of menus) {

            if (rootMenu.slug === slug) {

                return {
                    menu: rootMenu,
                    parent: null,
                };

            }

            const childMenu =
                rootMenu.children?.find(
                    (child) =>
                        child.slug === slug
                );

            if (childMenu) {

                return {
                    menu: childMenu,
                    parent: rootMenu,
                };

            }

        }

        return null;

    }, [
        menus,
        slug,
    ]);

    const selectedMenu =
        menuMatch?.menu ?? null;

    const parentMenu =
        menuMatch?.parent ?? null;

    const selectedMenuTitle =
        getLocalizedTitle(
            selectedMenu,
            language
        );

    const parentMenuTitle =
        getLocalizedTitle(
            parentMenu,
            language
        );

    const childMenus =
        selectedMenu?.children ?? [];

    const loadPages = async () => {

        if (!selectedMenu?.id) {

            setPages([]);
            setTotalRows(0);
            setTotalPages(1);
            setLoading(false);

            return;

        }

        try {

            setLoading(true);

            const response =
                await getPublicPages({
                    page,
                    search,
                    menu_id:
                        selectedMenu.id,
                });

            setPages(
                response.data ?? []
            );

            setTotalRows(
                response.meta?.total ??
                response.data?.length ??
                0
            );

            setTotalPages(
                response.meta?.last_page ??
                1
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                content.loadError
            );

            setPages([]);
            setTotalRows(0);
            setTotalPages(1);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        setPage(1);
        setSearch("");

    }, [slug]);

    useEffect(() => {

        loadPages();

    }, [
        selectedMenu?.id,
        page,
        search,
    ]);

    if (!selectedMenu) {

        return (
            <MenuNotFound
                content={content}
                isArabic={isArabic}
            />
        );

    }

    return (

        <Box
            dir={
                isArabic
                    ? "rtl"
                    : "ltr"
            }
        >

            {/* Header */}

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
                                    ? "15% 20%"
                                    : "85% 20%"
                            },
                            rgba(66,165,245,0.18),
                            transparent 30%
                        ),
                        linear-gradient(
                            135deg,
                            #f8fbff 0%,
                            #edf5ff 100%
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

                        {parentMenu && (

                            <Box
                                component={Link}
                                to={`/menu/${parentMenu.slug}`}
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

                        <Typography
                            sx={{
                                color:
                                    "text.primary",

                                fontSize: 13,

                                fontWeight:
                                    800,
                            }}
                        >
                            {selectedMenuTitle}
                        </Typography>

                    </Breadcrumbs>

                    <Stack
                        direction={{
                            xs: "column",

                            md: isArabic
                                ? "row-reverse"
                                : "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: isArabic
                                ? "flex-end"
                                : "flex-start",

                            md: "flex-end",
                        }}
                        spacing={3}
                    >

                        <Box
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
                                    parentMenu
                                        ? content.submenu
                                        : content.contentMenu
                                }
                                sx={{
                                    mb: 2,

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

                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: {
                                        xs: 36,
                                        sm: 44,
                                        md: 54,
                                    },

                                    lineHeight:
                                        isArabic
                                            ? 1.35
                                            : 1.05,

                                    letterSpacing:
                                        isArabic
                                            ? 0
                                            : -1.5,

                                    fontWeight:
                                        900,

                                    color:
                                        "#10233f",
                                }}
                            >
                                {selectedMenuTitle}
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
                                {content.description}
                            </Typography>

                        </Box>

                        <Box
                            sx={{
                                px: 2.5,
                                py: 1.5,

                                minWidth: 150,

                                borderRadius:
                                    2.5,

                                bgcolor:
                                    alpha(
                                        "#fff",
                                        0.74
                                    ),

                                border:
                                    "1px solid",

                                borderColor:
                                    alpha(
                                        "#14213d",
                                        0.08
                                    ),

                                backdropFilter:
                                    "blur(10px)",

                                textAlign:
                                    isArabic
                                        ? "right"
                                        : "left",
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 26,

                                    fontWeight:
                                        900,

                                    color:
                                        "#10233f",

                                    lineHeight: 1,
                                }}
                            >
                                {totalRows}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.6,

                                    fontSize: 11,

                                    fontWeight:
                                        800,

                                    color:
                                        "text.secondary",

                                    textTransform:
                                        isArabic
                                            ? "none"
                                            : "uppercase",

                                    letterSpacing:
                                        isArabic
                                            ? 0
                                            : 1,
                                }}
                            >
                                {totalRows === 1
                                    ? content.publishedPage
                                    : content.publishedPages}
                            </Typography>

                        </Box>

                    </Stack>

                </Container>

            </Box>

            {/* Main content */}

            <Box
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
                    maxWidth="xl"
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                    }}
                >

                    {/* Child menus */}

                    {childMenus.length > 0 && (

                        <Box
                            sx={{
                                mb: 5,

                                p: {
                                    xs: 2.5,
                                    sm: 3,
                                },

                                borderRadius:
                                    3,

                                bgcolor:
                                    "#fff",

                                border:
                                    "1px solid",

                                borderColor:
                                    alpha(
                                        "#14213d",
                                        0.08
                                    ),

                                boxShadow:
                                    "0 8px 24px rgba(15,23,42,0.04)",

                                textAlign:
                                    isArabic
                                        ? "right"
                                        : "left",
                            }}
                        >

                            <Typography
                                sx={{
                                    mb: 2,

                                    fontSize: 12,

                                    fontWeight:
                                        900,

                                    color:
                                        "primary.main",

                                    letterSpacing:
                                        isArabic
                                            ? 0
                                            : 1.5,

                                    textTransform:
                                        isArabic
                                            ? "none"
                                            : "uppercase",
                                }}
                            >
                                {content.exploreSubmenus}
                            </Typography>

                            <Stack
                                direction={
                                    isArabic
                                        ? "row-reverse"
                                        : "row"
                                }
                                flexWrap="wrap"
                                spacing={1}
                                useFlexGap
                            >

                                {childMenus.map(
                                    (child) => (

                                        <Button
                                            key={
                                                child.id
                                            }
                                            component={
                                                Link
                                            }
                                            to={`/menu/${child.slug}`}
                                            variant="outlined"
                                            startIcon={
                                                <MenuBookOutlinedIcon />
                                            }
                                            sx={{
                                                borderRadius:
                                                    20,

                                                px: 2,

                                                py: 0.8,

                                                textTransform:
                                                    "none",

                                                fontWeight:
                                                    800,

                                                "& .MuiButton-startIcon":
                                                    {
                                                        ml: isArabic
                                                            ? 1
                                                            : -0.5,

                                                        mr: isArabic
                                                            ? -0.5
                                                            : 1,
                                                    },
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

                        </Box>

                    )}

                    {/* Search and heading */}

                    <Stack
                        direction={{
                            xs: "column",

                            sm: isArabic
                                ? "row-reverse"
                                : "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "stretch",
                            sm: "center",
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
                                component="h2"
                                sx={{
                                    fontSize: {
                                        xs: 26,
                                        md: 32,
                                    },

                                    fontWeight:
                                        900,

                                    color:
                                        "#10233f",

                                    letterSpacing:
                                        isArabic
                                            ? 0
                                            : -0.7,

                                    lineHeight:
                                        isArabic
                                            ? 1.5
                                            : 1.2,
                                }}
                            >
                                {content.sectionTitle}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.6,

                                    color:
                                        "text.secondary",

                                    fontSize:
                                        14,

                                    lineHeight:
                                        isArabic
                                            ? 1.9
                                            : 1.5,
                                }}
                            >
                                {content.sectionDescriptionPrefix}{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight:
                                            700,

                                        color:
                                            "text.primary",
                                    }}
                                >
                                    {selectedMenuTitle}
                                </Box>
                                .
                            </Typography>

                        </Box>

                        <TextField
                            placeholder={
                                content.searchPlaceholder
                            }
                            size="small"
                            value={search}
                            onChange={(event) => {

                                setSearch(
                                    event.target.value
                                );

                                setPage(1);

                            }}
                            inputProps={{
                                dir: isArabic
                                    ? "rtl"
                                    : "ltr",
                            }}
                            InputProps={{
                                startAdornment: (

                                    <InputAdornment position="start">

                                        <SearchIcon
                                            sx={{
                                                color:
                                                    "text.disabled",

                                                fontSize:
                                                    20,
                                            }}
                                        />

                                    </InputAdornment>

                                ),
                            }}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: 330,
                                },

                                "& .MuiOutlinedInput-root": {
                                    borderRadius:
                                        2.5,

                                    bgcolor:
                                        "#fff",

                                    "& fieldset": {
                                        borderColor:
                                            alpha(
                                                "#14213d",
                                                0.1
                                            ),
                                    },

                                    "&:hover fieldset": {
                                        borderColor:
                                            alpha(
                                                "#1976d2",
                                                0.35
                                            ),
                                    },

                                    "&.Mui-focused fieldset": {
                                        borderColor:
                                            "primary.main",
                                    },
                                },

                                "& .MuiInputBase-input": {
                                    textAlign:
                                        isArabic
                                            ? "right"
                                            : "left",
                                },
                            }}
                        />

                    </Stack>

                    {/* Results */}

                    {loading ? (

                        <MenuPageSkeleton />

                    ) : pages.length === 0 ? (

                        <EmptyMenuPages
                            menuTitle={
                                selectedMenuTitle
                            }
                            hasSearch={
                                Boolean(
                                    search.trim()
                                )
                            }
                            content={
                                content
                            }
                            isArabic={
                                isArabic
                            }
                        />

                    ) : (

                        <>

                            <Grid
                                container
                                spacing={3}
                            >

                                {pages.map(
                                    (
                                        pageItem
                                    ) => (

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                lg: 4,
                                            }}
                                            key={
                                                pageItem.id
                                            }
                                        >

                                            <PageCard
                                                page={
                                                    pageItem
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

                            {totalPages > 1 && (

                                <Stack
                                    alignItems="center"
                                    sx={{
                                        mt: 6,
                                    }}
                                >

                                    <Pagination
                                        count={
                                            totalPages
                                        }
                                        page={
                                            page
                                        }
                                        onChange={(
                                            event,
                                            value
                                        ) => {

                                            setPage(
                                                value
                                            );

                                            window.scrollTo({
                                                top: 0,
                                                behavior:
                                                    "smooth",
                                            });

                                        }}
                                        color="primary"
                                        shape="rounded"
                                        size="large"
                                        siblingCount={1}
                                        boundaryCount={1}
                                        dir="ltr"
                                    />

                                </Stack>

                            )}

                        </>

                    )}

                </Container>

            </Box>

        </Box>

    );

};

const MenuPageSkeleton = () => (

    <Grid
        container
        spacing={3}
    >

        {[1, 2, 3, 4, 5, 6].map(
            (item) => (

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 4,
                    }}
                    key={item}
                >

                    <Skeleton
                        variant="rounded"
                        height={390}
                        sx={{
                            borderRadius:
                                4,
                        }}
                    />

                </Grid>

            )
        )}

    </Grid>

);

const EmptyMenuPages = ({
    menuTitle,
    hasSearch,
    content,
    isArabic = false,
}) => (

    <Box
        dir={
            isArabic
                ? "rtl"
                : "ltr"
        }
        sx={{
            py: 9,

            px: 3,

            textAlign:
                "center",

            borderRadius:
                4,

            bgcolor:
                "#fff",

            border:
                "1px dashed",

            borderColor:
                alpha(
                    "#14213d",
                    0.14
                ),
        }}
    >

        <DescriptionOutlinedIcon
            sx={{
                fontSize: 62,

                color:
                    "text.disabled",
            }}
        />

        <Typography
            sx={{
                mt: 2,

                fontSize:
                    21,

                fontWeight:
                    900,

                color:
                    "#10233f",

                lineHeight:
                    isArabic
                        ? 1.6
                        : 1.3,
            }}
        >
            {hasSearch
                ? content.noMatchingTitle
                : `${content.noPublishedPrefix} ${menuTitle}`}
        </Typography>

        <Typography
            sx={{
                mt: 1,

                maxWidth:
                    500,

                mx: "auto",

                color:
                    "text.secondary",

                lineHeight:
                    isArabic
                        ? 1.9
                        : 1.7,
            }}
        >
            {hasSearch
                ? content.tryAnotherSearch
                : content.automaticMessage}
        </Typography>

    </Box>

);

const MenuNotFound = ({
    content,
    isArabic = false,
}) => {

    const DirectionArrow =
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
                    "70vh",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                px: 3,

                bgcolor:
                    "#f7f8fb",
            }}
        >

            <Box
                sx={{
                    maxWidth:
                        560,

                    textAlign:
                        "center",
                }}
            >

                <MenuBookOutlinedIcon
                    sx={{
                        fontSize:
                            72,

                        color:
                            "text.disabled",
                    }}
                />

                <Typography
                    sx={{
                        mt: 2,

                        fontSize: {
                            xs: 30,
                            md: 38,
                        },

                        fontWeight:
                            900,

                        color:
                            "#10233f",

                        lineHeight:
                            isArabic
                                ? 1.5
                                : 1.2,
                    }}
                >
                    {content.menuNotFound}
                </Typography>

                <Typography
                    sx={{
                        mt: 1.5,

                        color:
                            "text.secondary",

                        lineHeight:
                            isArabic
                                ? 1.9
                                : 1.7,
                    }}
                >
                    {content.menuNotFoundDescription}
                </Typography>

                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    startIcon={
                        <DirectionArrow />
                    }
                    sx={{
                        mt: 3,

                        borderRadius:
                            2.5,

                        px: 3,

                        py: 1.2,

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
                    {content.backHome}
                </Button>

            </Box>

        </Box>

    );

};

export default MenuPages;