import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Box,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    InputAdornment,
    Button,
    Skeleton,
    alpha,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

import { toast } from "react-toastify";

import usePermissions from "../../hooks/usePermissions";

import {
    getDeletedPages,
} from "../../services/pageService";

import {
    getDeletedMenus,
} from "../../services/menuService";

import PageTrashTable from "../../components/AuditTrash/PageTrashTable";
import MenuTrashTable from "../../components/AuditTrash/MenuTrashTable";

import RestoreConfirmDialog from "../../components/AuditTrash/RestoreConfirmDialog";
import ForceDeleteConfirmDialog from "../../components/AuditTrash/ForceDeleteConfirmDialog";

const TAB_PAGES = 0;
const TAB_MENUS = 1;

const filterInputSx = {
    bgcolor: alpha("#000", 0.03),
    borderRadius: 2.5,
    fontSize: 14,

    "&:hover": {
        bgcolor: alpha("#000", 0.05),
    },

    "&.Mui-focused": {
        bgcolor: "#fff",
        boxShadow: "0 0 0 3px rgba(25,118,210,0.1)",
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

const AuditTrashList = () => {

    const { hasPermission } = usePermissions();

    const [activeTab, setActiveTab] = useState(TAB_PAGES);

    const [pages, setPages] = useState([]);

    const [menus, setMenus] = useState([]);

    const [pageTotalRows, setPageTotalRows] = useState(0);

    const [menuTotalRows, setMenuTotalRows] = useState(0);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [pagePaginationModel, setPagePaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [menuPaginationModel, setMenuPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [selectedItem, setSelectedItem] = useState(null);

    const [selectedType, setSelectedType] = useState(null);

    const [openRestore, setOpenRestore] = useState(false);

    const [openForceDelete, setOpenForceDelete] = useState(false);

    const canViewPages = hasPermission("page.trash.view");

    const canRestorePages = hasPermission("page.restore");

    const canForceDeletePages = hasPermission(
        "page.force_delete"
    );

    const canViewMenus = hasPermission("menu.trash.view");

    const canRestoreMenus = hasPermission("menu.restore");

    const canForceDeleteMenus = hasPermission(
        "menu.force_delete"
    );

    /*
    |--------------------------------------------------------------------------
    | Load deleted pages
    |--------------------------------------------------------------------------
    */

    const loadDeletedPages = useCallback(async () => {

        if (!canViewPages) {
            setPages([]);
            setPageTotalRows(0);
            return;
        }

        try {

            setLoading(true);

            const response = await getDeletedPages({
                page: pagePaginationModel.page + 1,
                search,
            });

            setPages(response.data ?? []);

            setPageTotalRows(
                response.meta?.total ?? 0
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load deleted pages."
            );

        } finally {

            setLoading(false);

        }

    }, [
        canViewPages,
        pagePaginationModel.page,
        search,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Load Deleted Menu
    |--------------------------------------------------------------------------
    */

    const loadDeletedMenus = useCallback(async () => {

        if (!canViewMenus) {
            setMenus([]);
            setMenuTotalRows(0);
            return;
        }

        try {

            setLoading(true);

            const response = await getDeletedMenus({
                page: menuPaginationModel.page + 1,
                search,
            });

            setMenus(response.data ?? []);

            setMenuTotalRows(
                response.meta?.total ?? 0
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load Deleted Menu."
            );

        } finally {

            setLoading(false);

        }

    }, [
        canViewMenus,
        menuPaginationModel.page,
        search,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Initial active tab
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!canViewPages && canViewMenus) {
            setActiveTab(TAB_MENUS);
        }

    }, [
        canViewPages,
        canViewMenus,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Load active tab
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (activeTab === TAB_PAGES) {
            loadDeletedPages();
            return;
        }

        loadDeletedMenus();

    }, [
        activeTab,
        loadDeletedPages,
        loadDeletedMenus,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Reset pagination when search changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setPagePaginationModel((previous) => ({
            ...previous,
            page: 0,
        }));

        setMenuPaginationModel((previous) => ({
            ...previous,
            page: 0,
        }));

    }, [search]);

    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    const handleTabChange = (
        event,
        newValue
    ) => {
        setActiveTab(newValue);
        setSearch("");
    };

    const handleRestore = (
        item,
        type
    ) => {
        setSelectedItem(item);
        setSelectedType(type);
        setOpenRestore(true);
    };

    const handleForceDelete = (
        item,
        type
    ) => {
        setSelectedItem(item);
        setSelectedType(type);
        setOpenForceDelete(true);
    };

    const closeRestoreDialog = () => {
        setOpenRestore(false);
        setSelectedItem(null);
        setSelectedType(null);
    };

    const closeForceDeleteDialog = () => {
        setOpenForceDelete(false);
        setSelectedItem(null);
        setSelectedType(null);
    };

    const refreshActiveTab = async () => {

        if (activeTab === TAB_PAGES) {
            await loadDeletedPages();
            return;
        }

        await loadDeletedMenus();

    };

    const handleClearFilters = () => {

        setSearch("");

        if (activeTab === TAB_PAGES) {

            setPagePaginationModel(
                (previous) => ({
                    ...previous,
                    page: 0,
                })
            );

            return;
        }

        setMenuPaginationModel(
            (previous) => ({
                ...previous,
                page: 0,
            })
        );

    };

    const currentRows =
        activeTab === TAB_PAGES
            ? pages
            : menus;

    const isEmpty =
        !loading &&
        currentRows.length === 0;

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
                    xs: "flex-start",
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
                                bgcolor: "error.main",
                            }}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                fontSize: 26,
                                color: "text.primary",
                                letterSpacing: -0.5,
                            }}
                        >
                            Audit & Trash
                        </Typography>

                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            fontSize: 14,
                            ml: 1.25,
                        }}
                    >
                        Review audit information, restore deleted records,
                        or permanently remove them.
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.75,
                        py: 0.9,
                        borderRadius: 2,
                        bgcolor: alpha("#d32f2f", 0.06),
                        border: "1px solid",
                        borderColor: alpha("#d32f2f", 0.12),
                    }}
                >

                    <DeleteSweepIcon
                        sx={{
                            color: "error.main",
                            fontSize: 20,
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "error.dark",
                        }}
                    >
                        Administrator Area
                    </Typography>

                </Box>

            </Stack>

            {/* Content Card */}

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "#fff",
                    overflow: "hidden",
                }}
            >

                {/* Tabs */}

                <Box
                    sx={{
                        px: 3,
                        pt: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        bgcolor: "#fcfcfd",
                    }}
                >

                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="Audit and trash tabs"
                        sx={{
                            minHeight: 50,

                            "& .MuiTabs-indicator": {
                                height: 3,
                                borderRadius: "3px 3px 0 0",
                            },

                            "& .MuiTab-root": {
                                minHeight: 50,
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: 14,
                                px: 2.5,
                            },

                            "& .Mui-selected": {
                                fontWeight: 700,
                            },
                        }}
                    >

                        {canViewPages && (

                            <Tab
                                value={TAB_PAGES}
                                icon={
                                    <DescriptionOutlinedIcon
                                        sx={{ fontSize: 20 }}
                                    />
                                }
                                iconPosition="start"
                                label={`Deleted Pages (${pageTotalRows})`}
                            />

                        )}

                        {canViewMenus && (

                            <Tab
                                value={TAB_MENUS}
                                icon={
                                    <MenuBookOutlinedIcon
                                        sx={{ fontSize: 20 }}
                                    />
                                }
                                iconPosition="start"
                                label={`Deleted Menu (${menuTotalRows})`}
                            />

                        )}

                    </Tabs>

                </Box>

                <Box sx={{ p: 3 }}>

                    {/* Search */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 3 }}
                    >

                        <TextField
                            placeholder={
                                activeTab === TAB_PAGES
                                    ? "Search deleted pages..."
                                    : "Search Deleted Menu..."
                            }
                            size="small"
                            fullWidth
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            sx={{
                                                fontSize: 20,
                                                color: "#9aa0aa",
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                maxWidth: {
                                    sm: 380,
                                },

                                "& .MuiOutlinedInput-root": {
                                    ...filterInputSx,
                                },
                            }}
                        />

                        <Button
                            variant="outlined"
                            startIcon={
                                <RestartAltIcon
                                    sx={{ fontSize: 18 }}
                                />
                            }
                            onClick={handleClearFilters}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 3,
                                py: 1.1,
                                fontSize: 13,
                                color: "text.secondary",
                                borderColor: "#d1d5db",

                                "&:hover": {
                                    borderWidth: 1.5,
                                    borderColor: "#9aa0aa",
                                    bgcolor: "#f9fafb",
                                },
                            }}
                        >
                            Clear
                        </Button>

                    </Stack>

                    {/* Loading */}

                    {loading ? (

                        <TrashTableSkeleton />

                    ) : isEmpty ? (

                        <TrashEmptyState
                            type={
                                activeTab === TAB_PAGES
                                    ? "pages"
                                    : "menus"
                            }
                        />

                    ) : activeTab === TAB_PAGES ? (

                        <PageTrashTable
                            pages={pages}
                            totalRows={pageTotalRows}
                            paginationModel={pagePaginationModel}
                            setPaginationModel={
                                setPagePaginationModel
                            }
                            onRestore={(page) =>
                                handleRestore(
                                    page,
                                    "page"
                                )
                            }
                            onForceDelete={(page) =>
                                handleForceDelete(
                                    page,
                                    "page"
                                )
                            }
                            canRestore={canRestorePages}
                            canForceDelete={
                                canForceDeletePages
                            }
                        />

                    ) : (

                        <MenuTrashTable
                            menus={menus}
                            totalRows={menuTotalRows}
                            paginationModel={menuPaginationModel}
                            setPaginationModel={
                                setMenuPaginationModel
                            }
                            onRestore={(menu) =>
                                handleRestore(
                                    menu,
                                    "menu"
                                )
                            }
                            onForceDelete={(menu) =>
                                handleForceDelete(
                                    menu,
                                    "menu"
                                )
                            }
                            canRestore={canRestoreMenus}
                            canForceDelete={
                                canForceDeleteMenus
                            }
                        />

                    )}

                </Box>

            </Paper>

            {/* Restore Dialog */}

            <RestoreConfirmDialog
                open={openRestore}
                item={selectedItem}
                type={selectedType}
                onClose={closeRestoreDialog}
                onSuccess={async () => {
                    closeRestoreDialog();
                    await refreshActiveTab();
                }}
            />

            {/* Permanent Delete Dialog */}

            <ForceDeleteConfirmDialog
                open={openForceDelete}
                item={selectedItem}
                type={selectedType}
                onClose={closeForceDeleteDialog}
                onSuccess={async () => {
                    closeForceDeleteDialog();
                    await refreshActiveTab();
                }}
            />

        </Box>

    );

};

const TrashTableSkeleton = () => {

    return (

        <Box>

            <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2 }}
            >

                {[24, 32, 18, 18, 16].map(
                    (width, index) => (

                        <Skeleton
                            key={index}
                            width={`${width}%`}
                            height={20}
                            sx={{ borderRadius: 1 }}
                        />

                    )
                )}

            </Stack>

            {[1, 2, 3, 4].map((row) => (

                <Stack
                    key={row}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                >

                    <Skeleton
                        width="28%"
                        height={17}
                    />

                    <Skeleton
                        width="22%"
                        height={17}
                    />

                    <Skeleton
                        width="16%"
                        height={17}
                    />

                    <Skeleton
                        width="16%"
                        height={17}
                    />

                    <Skeleton
                        width={100}
                        height={34}
                        sx={{
                            borderRadius: 1.5,
                            ml: "auto",
                        }}
                    />

                </Stack>

            ))}

        </Box>

    );

};

const TrashEmptyState = ({
    type,
}) => {

    const isPages = type === "pages";

    return (

        <Box
            sx={{
                textAlign: "center",
                py: 8,
                px: 4,
            }}
        >

            {isPages ? (

                <DescriptionOutlinedIcon
                    sx={{
                        fontSize: 58,
                        color: "#e0e0e0",
                        mb: 2,
                    }}
                />

            ) : (

                <MenuBookOutlinedIcon
                    sx={{
                        fontSize: 58,
                        color: "#e0e0e0",
                        mb: 2,
                    }}
                />

            )}

            <Typography
                sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    mb: 0.5,
                    fontSize: 16,
                }}
            >
                No deleted {type} found
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: "#9aa0aa",
                    fontSize: 14,
                    maxWidth: 360,
                    mx: "auto",
                }}
            >
                Deleted {type} will appear here and can be restored
                or permanently removed.
            </Typography>

        </Box>

    );

};

export default AuditTrashList;