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

const MenuPages = () => {

    const { slug } = useParams();

    const { menus = [] } = useOutletContext();

    const [pages, setPages] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [totalRows, setTotalRows] = useState(0);

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

            const response = await getPublicPages({
                page,
                search,
                menu_id: selectedMenu.id,
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
                response.meta?.last_page ?? 1
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load menu pages."
            );

            setPages([]);

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

    const childMenus =
        selectedMenu?.children ?? [];

    if (!selectedMenu) {

        return (
            <MenuNotFound />
        );

    }

    return (

        <Box>

            {/* Header section */}

            <Box
                component="section"
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    bgcolor: "#eef5ff",
                    backgroundImage: `
                        radial-gradient(
                            circle at 85% 20%,
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
                                color:
                                    "text.disabled",
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
                                color:
                                    "text.secondary",
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 700,

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

                            Home
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
                                    fontWeight: 700,

                                    "&:hover": {
                                        color:
                                            "primary.main",
                                    },
                                }}
                            >
                                {parentMenu.title}
                            </Box>

                        )}

                        <Typography
                            sx={{
                                color:
                                    "text.primary",
                                fontSize: 13,
                                fontWeight: 800,
                            }}
                        >
                            {selectedMenu.title}
                        </Typography>

                    </Breadcrumbs>

                    <Stack
                        direction={{
                            xs: "column",
                            md: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            md: "flex-end",
                        }}
                        spacing={3}
                    >

                        <Box
                            sx={{
                                maxWidth: 760,
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
                                        ? "Submenu"
                                        : "Content Menu"
                                }
                                sx={{
                                    mb: 2,
                                    bgcolor: alpha(
                                        "#1976d2",
                                        0.09
                                    ),
                                    color:
                                        "primary.main",
                                    fontWeight: 800,
                                    border: "1px solid",
                                    borderColor:
                                        alpha(
                                            "#1976d2",
                                            0.14
                                        ),

                                    "& .MuiChip-icon":
                                        {
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
                                    lineHeight: 1.05,
                                    letterSpacing: -1.5,
                                    fontWeight: 900,
                                    color: "#10233f",
                                }}
                            >
                                {selectedMenu.title}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2,
                                    maxWidth: 680,
                                    fontSize: {
                                        xs: 15,
                                        md: 17,
                                    },
                                    lineHeight: 1.75,
                                    color:
                                        "text.secondary",
                                }}
                            >
                                Browse all published pages
                                available under this menu.
                                Content is loaded directly from
                                the CMS and only visible once it
                                has been published and is due.
                            </Typography>

                        </Box>

                        <Box
                            sx={{
                                px: 2.5,
                                py: 1.5,
                                borderRadius: 2.5,
                                bgcolor:
                                    alpha(
                                        "#fff",
                                        0.74
                                    ),
                                border: "1px solid",
                                borderColor:
                                    alpha(
                                        "#14213d",
                                        0.08
                                    ),
                                backdropFilter:
                                    "blur(10px)",
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 26,
                                    fontWeight: 900,
                                    color: "#10233f",
                                    lineHeight: 1,
                                }}
                            >
                                {totalRows}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.6,
                                    fontSize: 11,
                                    fontWeight: 800,
                                    color:
                                        "text.secondary",
                                    textTransform:
                                        "uppercase",
                                    letterSpacing: 1,
                                }}
                            >
                                Published {
                                    totalRows === 1
                                        ? "Page"
                                        : "Pages"
                                }
                            </Typography>

                        </Box>

                    </Stack>

                </Container>

            </Box>

            {/* Content */}

            <Box
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
                                borderRadius: 3,
                                bgcolor: "#fff",
                                border: "1px solid",
                                borderColor: alpha(
                                    "#14213d",
                                    0.08
                                ),
                                boxShadow:
                                    "0 8px 24px rgba(15,23,42,0.04)",
                            }}
                        >

                            <Typography
                                sx={{
                                    mb: 2,
                                    fontSize: 12,
                                    fontWeight: 900,
                                    color:
                                        "primary.main",
                                    letterSpacing: 1.5,
                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                Explore submenus
                            </Typography>

                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                spacing={1}
                                useFlexGap
                            >

                                {childMenus.map(
                                    (child) => (

                                        <Button
                                            key={child.id}
                                            component={Link}
                                            to={`/menu/${child.slug}`}
                                            variant="outlined"
                                            startIcon={
                                                <MenuBookOutlinedIcon />
                                            }
                                            sx={{
                                                borderRadius: 20,
                                                px: 2,
                                                py: 0.8,
                                                textTransform:
                                                    "none",
                                                fontWeight: 800,
                                            }}
                                        >
                                            {child.title}
                                        </Button>

                                    )
                                )}

                            </Stack>

                        </Box>

                    )}

                    {/* Search */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "stretch",
                            sm: "center",
                        }}
                        spacing={2}
                        sx={{ mb: 4 }}
                    >

                        <Box>

                            <Typography
                                component="h2"
                                sx={{
                                    fontSize: {
                                        xs: 26,
                                        md: 32,
                                    },
                                    fontWeight: 900,
                                    color: "#10233f",
                                    letterSpacing: -0.7,
                                }}
                            >
                                Published Content
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.6,
                                    color:
                                        "text.secondary",
                                    fontSize: 14,
                                }}
                            >
                                Browse or search pages in {
                                    selectedMenu.title
                                }.
                            </Typography>

                        </Box>

                        <TextField
                            placeholder="Search pages..."
                            size="small"
                            value={search}
                            onChange={(event) => {

                                setSearch(
                                    event.target.value
                                );

                                setPage(1);

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

                                "& .MuiOutlinedInput-root":
                                    {
                                        borderRadius: 2.5,
                                        bgcolor: "#fff",

                                        "& fieldset": {
                                            borderColor:
                                                alpha(
                                                    "#14213d",
                                                    0.1
                                                ),
                                        },

                                        "&:hover fieldset":
                                            {
                                                borderColor:
                                                    alpha(
                                                        "#1976d2",
                                                        0.35
                                                    ),
                                            },

                                        "&.Mui-focused fieldset":
                                            {
                                                borderColor:
                                                    "primary.main",
                                            },
                                    },
                            }}
                        />

                    </Stack>

                    {loading ? (

                        <MenuPageSkeleton />

                    ) : pages.length === 0 ? (

                        <EmptyMenuPages
                            menuTitle={
                                selectedMenu.title
                            }
                            hasSearch={
                                Boolean(search)
                            }
                        />

                    ) : (

                        <>

                            <Grid
                                container
                                spacing={3}
                            >

                                {pages.map(
                                    (pageItem) => (

                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            lg={4}
                                            key={
                                                pageItem.id
                                            }
                                        >

                                            <PageCard
                                                page={
                                                    pageItem
                                                }
                                            />

                                        </Grid>

                                    )
                                )}

                            </Grid>

                            {totalPages > 1 && (

                                <Stack
                                    alignItems="center"
                                    sx={{ mt: 6 }}
                                >

                                    <Pagination
                                        count={
                                            totalPages
                                        }
                                        page={page}
                                        onChange={(
                                            event,
                                            value
                                        ) =>
                                            setPage(
                                                value
                                            )
                                        }
                                        color="primary"
                                        shape="rounded"
                                        size="large"
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

const MenuPageSkeleton = () => {

    return (

        <Grid
            container
            spacing={3}
        >

            {[1, 2, 3, 4, 5, 6].map(
                (item) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={4}
                        key={item}
                    >

                        <Skeleton
                            variant="rounded"
                            height={390}
                            sx={{
                                borderRadius: 4,
                            }}
                        />

                    </Grid>

                )
            )}

        </Grid>

    );

};

const EmptyMenuPages = ({
    menuTitle,
    hasSearch,
}) => {

    return (

        <Box
            sx={{
                py: 9,
                px: 3,
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "#fff",
                border: "1px dashed",
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
                    color: "text.disabled",
                }}
            />

            <Typography
                sx={{
                    mt: 2,
                    fontSize: 21,
                    fontWeight: 900,
                    color: "#10233f",
                }}
            >
                {hasSearch
                    ? "No matching pages found"
                    : `No published pages in ${menuTitle}`}
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    maxWidth: 500,
                    mx: "auto",
                    color: "text.secondary",
                    lineHeight: 1.7,
                }}
            >
                {hasSearch
                    ? "Try another search term."
                    : "Published and due pages will appear here automatically."}
            </Typography>

        </Box>

    );

};

const MenuNotFound = () => {

    return (

        <Box
            sx={{
                minHeight: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                bgcolor: "#f7f8fb",
            }}
        >

            <Box
                sx={{
                    maxWidth: 560,
                    textAlign: "center",
                }}
            >

                <MenuBookOutlinedIcon
                    sx={{
                        fontSize: 72,
                        color: "text.disabled",
                    }}
                />

                <Typography
                    sx={{
                        mt: 2,
                        fontSize: {
                            xs: 30,
                            md: 38,
                        },
                        fontWeight: 900,
                        color: "#10233f",
                    }}
                >
                    Menu not found
                </Typography>

                <Typography
                    sx={{
                        mt: 1.5,
                        color: "text.secondary",
                        lineHeight: 1.7,
                    }}
                >
                    The requested menu does not exist or is no longer publicly available.
                </Typography>

                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        mt: 3,
                        borderRadius: 2.5,
                        px: 3,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 800,
                    }}
                >
                    Back to Home
                </Button>

            </Box>

        </Box>

    );

};

export default MenuPages;