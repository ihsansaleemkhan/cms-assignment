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

const Home = () => {

    const { menus = [] } = useOutletContext();

    const [pages, setPages] = useState([]);

    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);

    const loadPages = async () => {

        try {

            setLoading(true);

            const response = await getPublicPages({
                page: 1,
            });

            setPages(response.data ?? []);

            setTotalPages(
                response.meta?.total ??
                response.data?.length ??
                0
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load published pages."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPages();

    }, []);

    const featuredPage = pages[0] ?? null;

    const supportingPages = pages.slice(1, 7);

    const visibleMenus = useMemo(() => {

        return menus.filter((menu) => {

            const rootPages =
                menu.pages?.length ?? 0;

            const childPages =
                menu.children?.reduce(
                    (total, child) =>
                        total +
                        (child.pages?.length ?? 0),
                    0
                ) ?? 0;

            return rootPages + childPages > 0;

        });

    }, [menus]);

    const menuCount = visibleMenus.reduce(
        (total, menu) =>
            total +
            1 +
            (menu.children?.length ?? 0),
        0
    );

    return (

        <Box>

            <HeroSection
                featuredPage={featuredPage}
                totalPages={totalPages}
                totalMenus={menuCount}
            />

            {/* Featured Content */}

            <Box
                component="section"
                id="featured-pages"
                sx={{
                    bgcolor: "#f7f8fb",
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
                        eyebrow="Latest content"
                        title="Featured published pages"
                        description="Explore the most recently published pages and discover content organized through the dynamic menu."
                    />

                    {loading ? (

                        <FeaturedSkeleton />

                    ) : pages.length === 0 ? (

                        <EmptyContent />

                    ) : (

                        <>

                            {featuredPage && (

                                <Box sx={{ mt: 5 }}>

                                    <PageCard
                                        page={featuredPage}
                                        featured
                                    />

                                </Box>

                            )}

                            {supportingPages.length > 0 && (

                                <Grid
                                    container
                                    spacing={3}
                                    sx={{ mt: 1 }}
                                >

                                    {supportingPages.map(
                                        (page) => (

                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                lg={4}
                                                key={page.id}
                                            >

                                                <PageCard
                                                    page={page}
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

                        <SectionHeading
                            eyebrow="Browse by category"
                            title="Explore our content menus"
                            description="Each section is generated from the menu structure managed in the CMS."
                        />

                        <Stack
                            spacing={{
                                xs: 6,
                                md: 8,
                            }}
                            sx={{ mt: 6 }}
                        >

                            {visibleMenus.map((menu) => (

                                <MenuContentSection
                                    key={menu.id}
                                    menu={menu}
                                />

                            ))}

                        </Stack>

                    </Container>

                </Box>

            )}

            {/* Call to action */}

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
                            position: "relative",
                            overflow: "hidden",
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
                                position: "absolute",
                                width: 320,
                                height: 320,
                                borderRadius: "50%",
                                bgcolor: alpha("#fff", 0.07),
                                top: -170,
                                right: -80,
                            }}
                        />

                        <Box
                            sx={{
                                position: "relative",
                                maxWidth: 720,
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 900,
                                    letterSpacing: 2,
                                    textTransform: "uppercase",
                                    color: "#bbdefb",
                                }}
                            >
                                Dynamic publishing
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1.5,
                                    fontSize: {
                                        xs: 30,
                                        sm: 38,
                                        md: 46,
                                    },
                                    lineHeight: 1.1,
                                    fontWeight: 900,
                                    letterSpacing: -1,
                                }}
                            >
                                Discover content that is organized,
                                current and easy to access.
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2.5,
                                    maxWidth: 620,
                                    fontSize: {
                                        xs: 15,
                                        md: 17,
                                    },
                                    lineHeight: 1.75,
                                    color: alpha("#fff", 0.78),
                                }}
                            >
                                Browse pages through our dynamic menus
                                and view content published directly from
                                the CMS.
                            </Typography>

                            {featuredPage && (

                                <Button
                                    component={Link}
                                    to={`/page/${featuredPage.slug}`}
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        mt: 4,
                                        px: 3.5,
                                        py: 1.4,
                                        borderRadius: 2.5,
                                        textTransform: "none",
                                        fontWeight: 800,
                                        bgcolor: "#fff",
                                        color: "#1565c0",
                                        boxShadow: "none",

                                        "&:hover": {
                                            bgcolor: "#eaf3ff",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    Start Exploring
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
}) => {

    const menuPages = [
        ...(menu.pages ?? []),

        ...(menu.children ?? []).flatMap(
            (child) =>
                (child.pages ?? []).map((page) => ({
                    ...page,

                    menu: page.menu ?? {
                        id: child.id,
                        title: child.title,
                        slug: child.slug,
                    },
                }))
        ),
    ];

    return (

        <Box>

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
                sx={{
                    pb: 2.5,
                    borderBottom: "1px solid",
                    borderColor: alpha("#14213d", 0.08),
                }}
            >

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >

                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: 2.5,
                            bgcolor: alpha("#1976d2", 0.08),
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <MenuBookOutlinedIcon />
                    </Box>

                    <Box>

                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: 24,
                                    md: 28,
                                },
                                fontWeight: 900,
                                lineHeight: 1.15,
                                color: "#10233f",
                                letterSpacing: -0.5,
                            }}
                        >
                            {menu.title}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 13.5,
                                color: "text.secondary",
                            }}
                        >
                            {menuPages.length} published {
                                menuPages.length === 1
                                    ? "page"
                                    : "pages"
                            }
                        </Typography>

                    </Box>

                </Stack>

                <Button
                    component={Link}
                    to={`/menu/${menu.slug}`}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                        textTransform: "none",
                        fontWeight: 800,
                        borderRadius: 2,
                        px: 2,
                    }}
                >
                    View All
                </Button>

            </Stack>

            {menuPages.length > 0 ? (

                <Grid
                    container
                    spacing={3}
                    sx={{ mt: 1 }}
                >

                    {menuPages
                        .slice(0, 3)
                        .map((page) => (

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                lg={4}
                                key={`${menu.id}-${page.id}`}
                            >

                                <PageCard
                                    page={{
                                        ...page,

                                        menu: page.menu ?? {
                                            id: menu.id,
                                            title: menu.title,
                                            slug: menu.slug,
                                        },
                                    }}
                                />

                            </Grid>

                        ))}

                </Grid>

            ) : (

                <Alert
                    severity="info"
                    sx={{
                        mt: 3,
                        borderRadius: 2.5,
                    }}
                >
                    No published pages are currently available in this menu.
                </Alert>

            )}

            {menu.children?.length > 0 && (

                <Stack
                    direction="row"
                    flexWrap="wrap"
                    useFlexGap
                    spacing={1}
                    sx={{ mt: 3 }}
                >

                    {menu.children.map((child) => (

                        <Button
                            key={child.id}
                            component={Link}
                            to={`/menu/${child.slug}`}
                            variant="outlined"
                            size="small"
                            sx={{
                                borderRadius: 20,
                                textTransform: "none",
                                fontWeight: 700,
                                px: 2,
                            }}
                        >
                            {child.title}
                        </Button>

                    ))}

                </Stack>

            )}

        </Box>

    );

};

const SectionHeading = ({
    eyebrow,
    title,
    description,
}) => {

    return (

        <Box
            sx={{
                maxWidth: 760,
            }}
        >

            <Typography
                sx={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: "primary.main",
                    textTransform: "uppercase",
                    letterSpacing: 2,
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
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: -1,
                    color: "#10233f",
                }}
            >
                {title}
            </Typography>

            <Typography
                sx={{
                    mt: 2,
                    maxWidth: 680,
                    fontSize: {
                        xs: 15,
                        md: 16.5,
                    },
                    lineHeight: 1.75,
                    color: "text.secondary",
                }}
            >
                {description}
            </Typography>

        </Box>

    );

};

const FeaturedSkeleton = () => {

    return (

        <Box sx={{ mt: 5 }}>

            <Skeleton
                variant="rounded"
                height={420}
                sx={{
                    borderRadius: 4,
                }}
            />

            <Grid
                container
                spacing={3}
                sx={{ mt: 1 }}
            >

                {[1, 2, 3].map((item) => (

                    <Grid
                        item
                        xs={12}
                        md={4}
                        key={item}
                    >
                        <Skeleton
                            variant="rounded"
                            height={360}
                            sx={{
                                borderRadius: 4,
                            }}
                        />
                    </Grid>

                ))}

            </Grid>

        </Box>

    );

};

const EmptyContent = () => {

    return (

        <Box
            sx={{
                mt: 5,
                py: 8,
                px: 3,
                textAlign: "center",
                borderRadius: 4,
                border: "1px dashed",
                borderColor: alpha("#14213d", 0.14),
                bgcolor: "#fff",
            }}
        >

            <DescriptionOutlinedIcon
                sx={{
                    fontSize: 58,
                    color: "text.disabled",
                }}
            />

            <Typography
                sx={{
                    mt: 2,
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#10233f",
                }}
            >
                No published pages available
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    color: "text.secondary",
                }}
            >
                Published and due pages will appear here automatically.
            </Typography>

        </Box>

    );

};

export default Home;