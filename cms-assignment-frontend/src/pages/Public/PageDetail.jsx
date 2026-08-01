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

const formatDate = (value) => {
    if (!value) {
        return null;
    }

    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const PageDetail = () => {

    const { slug } = useParams();

    const navigate = useNavigate();

    const { menus = [] } = useOutletContext();

    const [page, setPage] = useState(null);

    const [loading, setLoading] = useState(true);

    const [notFound, setNotFound] = useState(false);

    const loadPage = async () => {

        try {

            setLoading(true);

            setNotFound(false);

            const response = await getPublicPageBySlug(slug);

            setPage(response.data ?? null);

        } catch (error) {

            if (error.response?.status === 404) {

                setNotFound(true);

                setPage(null);

                return;

            }

            toast.error(
                error.response?.data?.message ??
                "Unable to load page."
            );

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

            if (rootMenu.id === page.menu.id) {
                return {
                    menu: rootMenu,
                    parent: null,
                };
            }

            const childMenu = rootMenu.children?.find(
                (child) => child.id === page.menu.id
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

            if (rootMenu.id === page.menu.id) {

                return (rootMenu.pages ?? [])
                    .filter(
                        (relatedPage) =>
                            relatedPage.id !== page.id
                    )
                    .slice(0, 3);

            }

            const childMenu = rootMenu.children?.find(
                (child) =>
                    child.id === page.menu.id
            );

            if (childMenu) {

                return (childMenu.pages ?? [])
                    .filter(
                        (relatedPage) =>
                            relatedPage.id !== page.id
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
        return <PageDetailSkeleton />;
    }

    if (notFound || !page) {
        return <PageNotFound />;
    }

    const publishedDate = formatDate(
        page.publish_date
    );

    const sanitizedBody = DOMPurify.sanitize(
        page.body ?? ""
    );

    return (

        <Box>

            {/* Page header */}

            <Box
                component="section"
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    bgcolor: "#eef5ff",
                    backgroundImage: `
                        radial-gradient(
                            circle at 88% 15%,
                            rgba(66,165,245,0.18),
                            transparent 30%
                        ),
                        linear-gradient(
                            135deg,
                            #f8fbff 0%,
                            #eef5ff 100%
                        )
                    `,
                    borderBottom: "1px solid",
                    borderColor: alpha(
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
                        aria-label="breadcrumb"
                        sx={{
                            mb: 3,

                            "& .MuiBreadcrumbs-separator": {
                                color: "text.disabled",
                            },
                        }}
                    >

                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                color: "text.secondary",
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 700,

                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}
                        >
                            <HomeOutlinedIcon
                                sx={{ fontSize: 17 }}
                            />

                            Home
                        </Box>

                        {menuMatch?.parent && (

                            <Box
                                component={Link}
                                to={`/menu/${menuMatch.parent.slug}`}
                                sx={{
                                    color: "text.secondary",
                                    textDecoration: "none",
                                    fontSize: 13,
                                    fontWeight: 700,

                                    "&:hover": {
                                        color: "primary.main",
                                    },
                                }}
                            >
                                {menuMatch.parent.title}
                            </Box>

                        )}

                        {menuMatch?.menu && (

                            <Box
                                component={Link}
                                to={`/menu/${menuMatch.menu.slug}`}
                                sx={{
                                    color: "text.secondary",
                                    textDecoration: "none",
                                    fontSize: 13,
                                    fontWeight: 700,

                                    "&:hover": {
                                        color: "primary.main",
                                    },
                                }}
                            >
                                {menuMatch.menu.title}
                            </Box>

                        )}

                        <Typography
                            sx={{
                                color: "text.primary",
                                fontSize: 13,
                                fontWeight: 800,
                                maxWidth: 260,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {page.title}
                        </Typography>

                    </Breadcrumbs>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                lg: "minmax(0, 0.95fr) minmax(440px, 1.05fr)",
                            },
                            gap: {
                                xs: 4,
                                lg: 7,
                            },
                            alignItems: "center",
                        }}
                    >

                        {/* Title */}

                        <Box>

                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mb: 2 }}
                            >

                                {page.menu?.title && (

                                    <Chip
                                        icon={
                                            <MenuBookOutlinedIcon
                                                sx={{ fontSize: 17 }}
                                            />
                                        }
                                        label={page.menu.title}
                                        sx={{
                                            bgcolor: alpha(
                                                "#1976d2",
                                                0.09
                                            ),
                                            color: "primary.main",
                                            fontWeight: 800,
                                            border: "1px solid",
                                            borderColor: alpha(
                                                "#1976d2",
                                                0.14
                                            ),

                                            "& .MuiChip-icon": {
                                                color: "primary.main",
                                            },
                                        }}
                                    />

                                )}

                                {publishedDate && (

                                    <Chip
                                        icon={
                                            <CalendarTodayOutlinedIcon
                                                sx={{ fontSize: 16 }}
                                            />
                                        }
                                        label={publishedDate}
                                        variant="outlined"
                                        sx={{
                                            bgcolor: alpha(
                                                "#fff",
                                                0.72
                                            ),
                                            color: "text.secondary",
                                            fontWeight: 700,
                                            borderColor: alpha(
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
                                    lineHeight: 1.04,
                                    letterSpacing: -1.7,
                                    fontWeight: 900,
                                    color: "#10233f",
                                }}
                            >
                                {page.title}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2.5,
                                    maxWidth: 680,
                                    fontSize: {
                                        xs: 15,
                                        md: 17,
                                    },
                                    lineHeight: 1.75,
                                    color: "text.secondary",
                                }}
                            >
                                Published content from the {
                                    page.menu?.title ??
                                    "website"
                                } section.
                            </Typography>

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={1.5}
                                sx={{ mt: 4 }}
                            >

                                <Button
                                    component={Link}
                                    to={
                                        page.menu?.slug
                                            ? `/menu/${page.menu.slug}`
                                            : "/"
                                    }
                                    variant="contained"
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        px: 3,
                                        py: 1.25,
                                        borderRadius: 2.5,
                                        textTransform: "none",
                                        fontWeight: 800,
                                    }}
                                >
                                    Back to {
                                        page.menu?.title ??
                                        "Home"
                                    }
                                </Button>

                                <Button
                                    component="a"
                                    href="#page-content"
                                    variant="outlined"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        px: 3,
                                        py: 1.2,
                                        borderRadius: 2.5,
                                        textTransform: "none",
                                        fontWeight: 800,
                                        color: "#10233f",
                                        borderColor: alpha(
                                            "#10233f",
                                            0.15
                                        ),

                                        "&:hover": {
                                            color: "primary.main",
                                            borderColor: "primary.main",
                                        },
                                    }}
                                >
                                    Read Content
                                </Button>

                            </Stack>

                        </Box>

                        {/* Cover image */}

                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                            }}
                        >

                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: "22px -14px -16px 24px",
                                    borderRadius: 5,
                                    bgcolor: alpha(
                                        "#1976d2",
                                        0.1
                                    ),
                                    transform: "rotate(2.5deg)",
                                }}
                            />

                            <Box
                                sx={{
                                    position: "relative",
                                    minHeight: {
                                        xs: 310,
                                        sm: 420,
                                        lg: 470,
                                    },
                                    borderRadius: {
                                        xs: 4,
                                        md: 5,
                                    },
                                    overflow: "hidden",
                                    bgcolor: "#1565c0",
                                    boxShadow:
                                        "0 24px 64px rgba(15,35,63,0.2)",
                                }}
                            >

                                {page.cover_image ? (

                                    <Box
                                        component="img"
                                        src={page.cover_image}
                                        alt={page.title}
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
                                                fontSize: 110,
                                                color: alpha(
                                                    "#fff",
                                                    0.8
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
                                            "linear-gradient(180deg, rgba(16,35,63,0.02) 45%, rgba(16,35,63,0.32) 100%)",
                                    }}
                                />

                            </Box>

                        </Box>

                    </Box>

                </Container>

            </Box>

            {/* Main content */}

            <Box
                id="page-content"
                component="section"
                sx={{
                    py: {
                        xs: 6,
                        md: 9,
                    },
                    bgcolor: "#f7f8fb",
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
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: {
                                xs: 3,
                                md: 4,
                            },
                            border: "1px solid",
                            borderColor: alpha(
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
                            direction="row"
                            alignItems="center"
                            spacing={1.25}
                            sx={{ mb: 3 }}
                        >

                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    bgcolor: alpha(
                                        "#1976d2",
                                        0.08
                                    ),
                                    color: "primary.main",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <DescriptionOutlinedIcon />
                            </Box>

                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 11,
                                        fontWeight: 900,
                                        color: "primary.main",
                                        letterSpacing: 1.6,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Page Content
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.2,
                                        fontSize: 13,
                                        color: "text.secondary",
                                    }}
                                >
                                    Published from the CMS
                                </Typography>

                            </Box>

                        </Stack>

                        <Divider sx={{ mb: 4 }} />

                        <Box
                            className="public-page-content"
                            dangerouslySetInnerHTML={{
                                __html: sanitizedBody,
                            }}
                            sx={{
                                color: "#293548",
                                fontSize: {
                                    xs: 15.5,
                                    md: 17,
                                },
                                lineHeight: 1.85,
                                overflowWrap: "anywhere",

                                "& > *:first-of-type": {
                                    mt: 0,
                                },

                                "& > *:last-child": {
                                    mb: 0,
                                },

                                "& h1, & h2, & h3, & h4, & h5, & h6": {
                                    color: "#10233f",
                                    fontWeight: 900,
                                    lineHeight: 1.2,
                                    letterSpacing: -0.4,
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
                                    color: "primary.main",
                                    fontWeight: 700,
                                },

                                "& img": {
                                    display: "block",
                                    maxWidth: "100%",
                                    height: "auto",
                                    borderRadius: 3,
                                    my: 3,
                                    boxShadow:
                                        "0 12px 28px rgba(15,23,42,0.1)",
                                },

                                "& figure": {
                                    maxWidth: "100%",
                                    my: 3,
                                    mx: 0,
                                },

                                "& figcaption": {
                                    mt: 1,
                                    color: "text.secondary",
                                    fontSize: 13,
                                    textAlign: "center",
                                },

                                "& blockquote": {
                                    my: 3,
                                    mx: 0,
                                    py: 1.5,
                                    pl: 2.5,
                                    borderLeft: "4px solid",
                                    borderColor: "primary.main",
                                    bgcolor: alpha(
                                        "#1976d2",
                                        0.05
                                    ),
                                    borderRadius: "0 12px 12px 0",
                                    color: "#42516a",
                                    fontStyle: "italic",
                                },

                                "& ul, & ol": {
                                    pl: 3,
                                    mb: 2,
                                },

                                "& li": {
                                    mb: 0.75,
                                },

                                "& table": {
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    my: 3,
                                },

                                "& th, & td": {
                                    border: "1px solid #dfe4ea",
                                    px: 2,
                                    py: 1.25,
                                    textAlign: "left",
                                },

                                "& th": {
                                    bgcolor: "#f4f7fb",
                                    color: "#10233f",
                                    fontWeight: 800,
                                },

                                "& .table": {
                                    width: "100%",
                                    overflowX: "auto",
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
                        bgcolor: "#fff",
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
                                sm: "row",
                            }}
                            justifyContent="space-between"
                            alignItems={{
                                xs: "flex-start",
                                sm: "flex-end",
                            }}
                            spacing={2}
                            sx={{ mb: 4 }}
                        >

                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 11,
                                        fontWeight: 900,
                                        color: "primary.main",
                                        letterSpacing: 1.8,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Continue exploring
                                </Typography>

                                <Typography
                                    component="h2"
                                    sx={{
                                        mt: 1,
                                        fontSize: {
                                            xs: 30,
                                            md: 40,
                                        },
                                        fontWeight: 900,
                                        color: "#10233f",
                                        letterSpacing: -0.8,
                                    }}
                                >
                                    Related Pages
                                </Typography>

                            </Box>

                            <Button
                                component={Link}
                                to={`/menu/${page.menu.slug}`}
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 800,
                                }}
                            >
                                View All {
                                    page.menu.title
                                }
                            </Button>

                        </Stack>

                        <Grid
                            container
                            spacing={3}
                        >

                            {relatedPages.map(
                                (relatedPage) => (

                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        key={relatedPage.id}
                                    >

                                        <PageCard
                                            page={{
                                                ...relatedPage,

                                                menu:
                                                    relatedPage.menu ??
                                                    page.menu,
                                            }}
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

const PageDetailSkeleton = () => {

    return (

        <Box>

            <Box
                sx={{
                    bgcolor: "#eef5ff",
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
                        sx={{ mt: 1 }}
                    >

                        <Grid
                            item
                            xs={12}
                            lg={6}
                        >

                            <Skeleton
                                width={130}
                                height={36}
                                sx={{
                                    borderRadius: 20,
                                }}
                            />

                            <Skeleton
                                height={72}
                                sx={{
                                    mt: 2,
                                    maxWidth: 650,
                                }}
                            />

                            <Skeleton
                                height={72}
                                sx={{
                                    maxWidth: 560,
                                }}
                            />

                            <Skeleton
                                width="72%"
                                height={28}
                                sx={{ mt: 2 }}
                            />

                            <Skeleton
                                width={240}
                                height={52}
                                sx={{
                                    mt: 3,
                                    borderRadius: 2.5,
                                }}
                            />

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            lg={6}
                        >

                            <Skeleton
                                variant="rounded"
                                height={430}
                                sx={{
                                    borderRadius: 5,
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
                        borderRadius: 4,
                    }}
                />

            </Container>

        </Box>

    );

};

const PageNotFound = () => {

    const navigate = useNavigate();

    return (

        <Box
            sx={{
                minHeight: "72vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                py: 6,
                bgcolor: "#f7f8fb",
            }}
        >

            <Box
                sx={{
                    maxWidth: 580,
                    textAlign: "center",
                }}
            >

                <DescriptionOutlinedIcon
                    sx={{
                        fontSize: 78,
                        color: "text.disabled",
                    }}
                />

                <Typography
                    sx={{
                        mt: 2,
                        fontSize: {
                            xs: 31,
                            md: 42,
                        },
                        fontWeight: 900,
                        color: "#10233f",
                        letterSpacing: -0.8,
                    }}
                >
                    Page not found
                </Typography>

                <Typography
                    sx={{
                        mt: 1.5,
                        color: "text.secondary",
                        lineHeight: 1.75,
                    }}
                >
                    The requested page does not exist, has not been
                    published, or is scheduled for a future date.
                </Typography>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    justifyContent="center"
                    spacing={1.5}
                    sx={{ mt: 3.5 }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            px: 3,
                            py: 1.15,
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 800,
                        }}
                    >
                        Go Back
                    </Button>

                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        sx={{
                            px: 3,
                            py: 1.2,
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 800,
                        }}
                    >
                        Return Home
                    </Button>

                </Stack>

            </Box>

        </Box>

    );

};

export default PageDetail;