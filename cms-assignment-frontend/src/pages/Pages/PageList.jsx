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
    alpha,
} from "@mui/material";

import {
    Add,
    Search,
    Description,
    RestartAlt,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import usePermissions from "../../hooks/usePermissions";

import { getPages } from "../../services/pageService";
import { getAllMenus } from "../../services/menuService";

import PageTable from "../../components/Pages/PageTable";

import CreatePageDialog from "../../components/Pages/CreatePageDialog";
import EditPageDialog from "../../components/Pages/EditPageDialog";
import DeletePageDialog from "../../components/Pages/DeletePageDialog";

// Shared styles for the sleek filter inputs
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
        boxShadow: "0 0 0 3px rgba(25,118,210,0.1)",
    },
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "transparent" },
    "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        borderWidth: 1.5,
    },
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
            setMenus(data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadPages = async () => {
        try {
            setLoading(true);
            const response = await getPages({
                page: paginationModel.page + 1,
                search,
                menu_id: menuId,
                status,
            });
            setPages(response.data);
            setTotalRows(response.meta.total);
        } catch (error) {
            toast.error(
                error.response?.data?.message ?? "Unable to load pages."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMenus();
    }, []);

    useEffect(() => {
        loadPages();
    }, [paginationModel.page, search, menuId, status]);

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [search, menuId, status]);

    const handleEdit = (id) => {
        setSelectedPageId(id);
        setOpenEdit(true);
    };

    const handleDelete = (page) => {
        setSelectedPage(page);
        setOpenDelete(true);
    };

    return (

        <Box>

            {/* ── Page Header ── */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
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
                                bgcolor: "primary.main",
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
                            Page Management
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
                        Create, edit, and manage all your website pages.
                    </Typography>
                </Box>

                {hasPermission("page.create") && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenCreate(true)}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 3.5,
                            py: 1.1,
                            fontSize: 14,
                            boxShadow: "0 2px 8px rgba(25,118,210,0.35)",
                            "&:hover": {
                                boxShadow: "0 4px 14px rgba(25,118,210,0.45)",
                            },
                        }}
                    >
                        Create Page
                    </Button>
                )}
            </Stack>

            {/* ── Content Card ── */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "#fff",
                }}
            >
                {/* ── Filters ── */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    mb={3}
                    alignItems="center"
                >
                    <TextField
                        placeholder="Search by title..."
                        size="small"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ fontSize: 20, color: "#9aa0aa" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            maxWidth: { md: 300 },
                            "& .MuiOutlinedInput-root": {
                                ...filterInputSx,
                            },
                        }}
                    />

                    <FormControl size="small" fullWidth sx={{ maxWidth: { md: 220 } }}>
                        <Select
                            displayEmpty
                            value={menuId}
                            onChange={(e) => setMenuId(e.target.value)}
                            sx={filterInputSx}
                        >
                            <MenuItem value="">
                                <Typography sx={{ color: "#aaa" }}>All Menus</Typography>
                            </MenuItem>
                            {menus.map((menu) => (
                                <MenuItem key={menu.id} value={menu.id}>
                                    {menu.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" fullWidth sx={{ maxWidth: { md: 180 } }}>
                        <Select
                            displayEmpty
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            sx={filterInputSx}
                        >
                            <MenuItem value="">
                                <Typography sx={{ color: "#aaa" }}>All Status</Typography>
                            </MenuItem>
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="published">Published</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        startIcon={<RestartAlt sx={{ fontSize: 18 }} />}
                        onClick={() => {
                            setSearch("");
                            setMenuId("");
                            setStatus("");
                        }}
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

                {/* ── State Rendering ── */}
                {loading ? (
                    
                    /* Structural Table Skeleton */
                    <Box>
                        {/* Fake Header Row */}
                        <Stack direction="row" spacing={2} mb={2}>
                            {[50, 20, 15, 15, 20].map((w, i) => (
                                <Skeleton 
                                    key={i} 
                                    width={`${w}%`} 
                                    height={20} 
                                    sx={{ borderRadius: 1 }} 
                                />
                            ))}
                        </Stack>
                        {/* Fake Body Rows */}
                        {[1, 2, 3, 4].map((i) => (
                            <Stack 
                                key={i} 
                                direction="row" 
                                spacing={2} 
                                mb={1.5} 
                                alignItems="center"
                            >
                                <Skeleton width={40} height={40} sx={{ borderRadius: 1.5 }} />
                                <Skeleton width="40%" height={16} />
                                <Skeleton width="15%" height={16} />
                                <Skeleton width="10%" height={16} />
                                <Skeleton width="15%" height={16} />
                                <Skeleton 
                                    width={80} 
                                    height={32} 
                                    sx={{ borderRadius: 1.5, ml: "auto" }} 
                                />
                            </Stack>
                        ))}
                    </Box>

                ) : pages.length === 0 ? (
                    
                    /* Empty State */
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
                                color: "text.secondary",
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
                                maxWidth: 300,
                                mx: "auto",
                            }}
                        >
                            Try adjusting your search or filters, or create a new page to get started.
                        </Typography>
                    </Box>

                ) : (
                    <PageTable
                        pages={pages}
                        totalRows={totalRows}
                        paginationModel={paginationModel}
                        setPaginationModel={setPaginationModel}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={hasPermission("page.edit")}
                        canDelete={hasPermission("page.delete")}
                    />
                )}
            </Paper>

            {/* ── Dialogs ── */}
            <CreatePageDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={loadPages}
            />

            <EditPageDialog
                open={openEdit}
                pageId={selectedPageId}
                onClose={() => setOpenEdit(false)}
                onSuccess={loadPages}
            />

            <DeletePageDialog
                open={openDelete}
                page={selectedPage}
                onClose={() => setOpenDelete(false)}
                onSuccess={loadPages}
            />

        </Box>

    );

};

export default PageList;