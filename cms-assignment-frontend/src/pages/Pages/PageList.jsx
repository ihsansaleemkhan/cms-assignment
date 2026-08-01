import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Stack,
    Skeleton,
    FormControl,
    Select,
    MenuItem,
    InputAdornment,
    Chip,
    alpha,
} from "@mui/material";

import {
    Add,
    Search,
    Description,
    RestartAlt,
    Translate,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import usePermissions from "../../hooks/usePermissions";

import { getPages } from "../../services/pageService";
import { getAllMenus } from "../../services/menuService";

import PageTable from "../../components/Pages/PageTable";

import CreatePageDialog from "../../components/Pages/CreatePageDialog";
import EditPageDialog from "../../components/Pages/EditPageDialog";
import DeletePageDialog from "../../components/Pages/DeletePageDialog";

const filterInputSx = {
    bgcolor: alpha("#000", 0.03),
    borderRadius: 2.5,
    fontSize: 14,

    "& .MuiSelect-select": {
        py: 1.2,
    },

    "&:hover": {
        bgcolor: alpha("#000", 0.05),
    },

    "&.Mui-focused": {
        bgcolor: "#fff",
        boxShadow:
            "0 0 0 3px rgba(25,118,210,0.1)",
    },

    "& fieldset": {
        borderColor: "transparent",
    },

    "&:hover fieldset": {
        borderColor: "transparent",
    },

    "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        borderWidth: 1.5,
    },
};

const flattenMenus = (
    items = [],
    level = 0
) => {

    let result = [];

    items.forEach((menu) => {

        result.push({
            ...menu,
            displayTitle:
                `${"— ".repeat(level)}${menu.title}`,
        });

        if (menu.children?.length) {

            result = result.concat(
                flattenMenus(
                    menu.children,
                    level + 1
                )
            );

        }

    });

    return result;
};

const PageList = () => {

    const { hasPermission } = usePermissions();

    const [pages, setPages] = useState([]);

    const [menus, setMenus] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [menuId, setMenuId] = useState("");

    const [status, setStatus] = useState("");

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [totalRows, setTotalRows] = useState(0);

    const [openCreate, setOpenCreate] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [selectedPageId, setSelectedPageId] = useState(null);

    const [selectedPage, setSelectedPage] = useState(null);

    const loadMenus = async () => {

        try {

            const data = await getAllMenus();

            setMenus(
                flattenMenus(data ?? [])
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load menus."
            );

            setMenus([]);

        }

    };

    const loadPages = async () => {

        try {

            setLoading(true);

            const response = await getPages({
                page:
                    paginationModel.page + 1,
                search,
                menu_id: menuId,
                status,
            });

            setPages(
                response.data ?? []
            );

            setTotalRows(
                response.meta?.total ?? 0
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load pages."
            );

            setPages([]);

            setTotalRows(0);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadMenus();

    }, []);

    useEffect(() => {

        loadPages();

    }, [
        paginationModel.page,
        search,
        menuId,
        status,
    ]);

    useEffect(() => {

        setPaginationModel(
            (previous) => ({
                ...previous,
                page: 0,
            })
        );

    }, [
        search,
        menuId,
        status,
    ]);

    const handleEdit = (id) => {

        setSelectedPageId(id);

        setOpenEdit(true);

    };

    const handleDelete = (page) => {

        setSelectedPage(page);

        setOpenDelete(true);

    };

    const handleClearFilters = () => {

        setSearch("");

        setMenuId("");

        setStatus("");

        setPaginationModel(
            (previous) => ({
                ...previous,
                page: 0,
            })
        );

    };

    return (

        <Box>

            {/* Page Header */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "stretch",
                    sm: "flex-end",
                }}
                spacing={2}
                sx={{ mb: 4 }}
            >

                <Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                        }}
                    >

                        <Box
                            sx={{
                                width: 4,
                                height: 26,
                                borderRadius: 2,
                                bgcolor:
                                    "primary.main",
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                fontSize: 26,
                                color:
                                    "text.primary",
                                letterSpacing:
                                    -0.5,
                            }}
                        >
                            Page Management
                        </Typography>

                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            color:
                                "text.secondary",
                            fontSize: 14,
                            ml: 1.25,
                        }}
                    >
                        Manage English and Arabic page content from one place.
                    </Typography>

                    <Chip
                        size="small"
                        icon={
                            <Translate
                                sx={{
                                    fontSize:
                                        "16px !important",
                                }}
                            />
                        }
                        label="English + Arabic Ready"
                        color="primary"
                        variant="outlined"
                        sx={{
                            mt: 1.5,
                            ml: 1.25,
                            fontWeight: 700,
                        }}
                    />

                </Box>

                {hasPermission("page.create") && (

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() =>
                            setOpenCreate(true)
                        }
                        sx={{
                            textTransform:
                                "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 3.5,
                            py: 1.1,
                            fontSize: 14,
                            boxShadow:
                                "0 2px 8px rgba(25,118,210,0.35)",

                            "&:hover": {
                                boxShadow:
                                    "0 4px 14px rgba(25,118,210,0.45)",
                            },
                        }}
                    >
                        Create Page
                    </Button>

                )}

            </Stack>

            {/* Content Card */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                    },
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "#fff",
                }}
            >

                {/* Filters */}

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={2}
                    mb={3}
                    alignItems={{
                        xs: "stretch",
                        md: "center",
                    }}
                >

                    <TextField
                        placeholder="Search English title, Arabic title or slug..."
                        size="small"
                        fullWidth
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        InputProps={{
                            startAdornment: (

                                <InputAdornment position="start">

                                    <Search
                                        sx={{
                                            fontSize: 20,
                                            color:
                                                "#9aa0aa",
                                        }}
                                    />

                                </InputAdornment>

                            ),
                        }}
                        sx={{
                            maxWidth: {
                                md: 380,
                            },

                            "& .MuiOutlinedInput-root": {
                                ...filterInputSx,
                            },
                        }}
                    />

                    <FormControl
                        size="small"
                        fullWidth
                        sx={{
                            maxWidth: {
                                md: 240,
                            },
                        }}
                    >

                        <Select
                            displayEmpty
                            value={menuId}
                            onChange={(event) =>
                                setMenuId(
                                    event.target.value
                                )
                            }
                            sx={filterInputSx}
                        >

                            <MenuItem value="">

                                <Typography
                                    sx={{
                                        color:
                                            "#aaa",
                                    }}
                                >
                                    All Menus
                                </Typography>

                            </MenuItem>

                            {menus.map((menu) => (

                                <MenuItem
                                    key={menu.id}
                                    value={menu.id}
                                >

                                    <Box>

                                        <Typography
                                            sx={{
                                                fontSize:
                                                    14,
                                            }}
                                        >
                                            {
                                                menu.displayTitle
                                            }
                                        </Typography>

                                        {menu.title_ar && (

                                            <Typography
                                                dir="rtl"
                                                sx={{
                                                    mt: 0.25,
                                                    fontSize:
                                                        11.5,
                                                    color:
                                                        "text.secondary",
                                                    textAlign:
                                                        "left",
                                                    fontFamily:
                                                        "'Noto Sans Arabic', Arial, sans-serif",
                                                }}
                                            >
                                                {
                                                    menu.title_ar
                                                }
                                            </Typography>

                                        )}

                                    </Box>

                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>

                    <FormControl
                        size="small"
                        fullWidth
                        sx={{
                            maxWidth: {
                                md: 180,
                            },
                        }}
                    >

                        <Select
                            displayEmpty
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                            sx={filterInputSx}
                        >

                            <MenuItem value="">

                                <Typography
                                    sx={{
                                        color:
                                            "#aaa",
                                    }}
                                >
                                    All Status
                                </Typography>

                            </MenuItem>

                            <MenuItem value="draft">
                                Draft
                            </MenuItem>

                            <MenuItem value="published">
                                Published
                            </MenuItem>

                        </Select>

                    </FormControl>

                    <Button
                        variant="outlined"
                        startIcon={
                            <RestartAlt
                                sx={{
                                    fontSize: 18,
                                }}
                            />
                        }
                        onClick={
                            handleClearFilters
                        }
                        sx={{
                            textTransform:
                                "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            py: 1.1,
                            fontSize: 13,
                            color:
                                "text.secondary",
                            borderColor:
                                "#d1d5db",
                            whiteSpace:
                                "nowrap",

                            "&:hover": {
                                borderWidth:
                                    1.5,
                                borderColor:
                                    "#9aa0aa",
                                bgcolor:
                                    "#f9fafb",
                            },
                        }}
                    >
                        Clear
                    </Button>

                </Stack>

                {/* Loading */}

                {loading ? (

                    <Box>

                        <Stack
                            direction="row"
                            spacing={2}
                            mb={2}
                        >

                            {[
                                8,
                                28,
                                18,
                                12,
                                12,
                                16,
                                10,
                            ].map(
                                (
                                    width,
                                    index
                                ) => (

                                    <Skeleton
                                        key={
                                            index
                                        }
                                        width={`${width}%`}
                                        height={20}
                                        sx={{
                                            borderRadius:
                                                1,
                                        }}
                                    />

                                )
                            )}

                        </Stack>

                        {[1, 2, 3, 4].map(
                            (item) => (

                                <Stack
                                    key={item}
                                    direction="row"
                                    spacing={2}
                                    mb={1.5}
                                    alignItems="center"
                                >

                                    <Skeleton
                                        width={52}
                                        height={52}
                                        sx={{
                                            borderRadius:
                                                1.5,
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            width:
                                                "28%",
                                        }}
                                    >
                                        <Skeleton
                                            width="90%"
                                            height={18}
                                        />
                                        <Skeleton
                                            width="70%"
                                            height={14}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            width:
                                                "18%",
                                        }}
                                    >
                                        <Skeleton
                                            width="80%"
                                            height={17}
                                        />
                                        <Skeleton
                                            width="60%"
                                            height={13}
                                        />
                                    </Box>

                                    <Skeleton
                                        width="10%"
                                        height={26}
                                        sx={{
                                            borderRadius:
                                                10,
                                        }}
                                    />

                                    <Skeleton
                                        width="10%"
                                        height={26}
                                        sx={{
                                            borderRadius:
                                                10,
                                        }}
                                    />

                                    <Skeleton
                                        width="14%"
                                        height={18}
                                    />

                                    <Skeleton
                                        width={80}
                                        height={32}
                                        sx={{
                                            borderRadius:
                                                1.5,
                                            ml: "auto",
                                        }}
                                    />

                                </Stack>

                            )
                        )}

                    </Box>

                ) : pages.length === 0 ? (

                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            px: 4,
                        }}
                    >

                        <Description
                            sx={{
                                fontSize: 56,
                                color: "#e0e0e0",
                                mb: 2,
                            }}
                        />

                        <Typography
                            sx={{
                                fontWeight: 600,
                                color:
                                    "text.secondary",
                                mb: 0.5,
                                fontSize: 16,
                            }}
                        >
                            No pages found
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#9aa0aa",
                                fontSize: 14,
                                maxWidth: 420,
                                mx: "auto",
                            }}
                        >
                            Try another English or Arabic title, slug, menu or
                            status filter, or create a new multilingual page.
                        </Typography>

                    </Box>

                ) : (

                    <PageTable
                        pages={pages}
                        totalRows={totalRows}
                        paginationModel={
                            paginationModel
                        }
                        setPaginationModel={
                            setPaginationModel
                        }
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={
                            hasPermission(
                                "page.edit"
                            )
                        }
                        canDelete={
                            hasPermission(
                                "page.delete"
                            )
                        }
                    />

                )}

            </Paper>

            {/* Dialogs */}

            <CreatePageDialog
                open={openCreate}
                onClose={() =>
                    setOpenCreate(false)
                }
                onSuccess={
                    loadPages
                }
            />

            <EditPageDialog
                open={openEdit}
                pageId={
                    selectedPageId
                }
                onClose={() => {
                    setOpenEdit(false);
                    setSelectedPageId(null);
                }}
                onSuccess={
                    loadPages
                }
            />

            <DeletePageDialog
                open={openDelete}
                page={selectedPage}
                onClose={() => {
                    setOpenDelete(false);
                    setSelectedPage(null);
                }}
                onSuccess={
                    loadPages
                }
            />

        </Box>

    );

};

export default PageList;