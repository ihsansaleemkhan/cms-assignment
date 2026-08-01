import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Stack,
    Skeleton,
    InputAdornment,
    alpha,
} from "@mui/material";

import {
    Add,
    Search,
    MenuBook,
} from "@mui/icons-material";

import MenuTree from "../../components/Menu/MenuTree";

import {
    getMenus,
    reorderMenus,
} from "../../services/menuService";

import usePermissions from "../../hooks/usePermissions";

import CreateMenuDialog from "../../components/Menu/CreateMenuDialog";

import EditMenuDialog from "../../components/Menu/EditMenuDialog";

import DeleteMenuDialog from "../../components/Menu/DeleteMenuDialog";

import { toast } from "react-toastify";

const MenuList = () => {

    const { hasPermission } = usePermissions();

    const [menus, setMenus] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [totalRows, setTotalRows] = useState(0);

    const loadMenus = async () => {

        try {

            setLoading(true);

            const response = await getMenus({
                page: paginationModel.page + 1,
                search,
            });

            setMenus(response.data);

            setTotalRows(response.meta.total);

        } finally {

            setLoading(false);

        }

    };

    const [openCreate, setOpenCreate] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [selectedMenu, setSelectedMenu] = useState(null);

    const [selectedMenuId, setSelectedMenuId] = useState(null);

    const handleEdit = (id) => {
        setSelectedMenuId(id);
        setOpenEdit(true);
    };

    const handleDelete = (menu) => {
        setSelectedMenu(menu);
        setOpenDelete(true);
    };

    const handleReorder = async (newMenus) => {

        try {

            const payload = newMenus.map((menu, index) => ({
                id: menu.id,
                parent_id: null,
                sort_order: index + 1,
            }));

            await reorderMenus(payload);

            toast.success("Menu order updated");

            loadMenus();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to reorder menus."
            );

        }

    };

    useEffect(() => {
        loadMenus();
    }, [paginationModel, search]);

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
                            Menu Management
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
                        Organize and manage your website navigation structure.
                    </Typography>
                </Box>

                {hasPermission("menu.create") && (
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
                        Create Menu
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
                {/* ── Search Bar ── */}
                <TextField
                    placeholder="Search menus..."
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
                        mb: 3,
                        maxWidth: 400,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                            bgcolor: alpha("#000", 0.03),
                            fontSize: 14,
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
                        },
                    }}
                />

                {/* ── State Rendering ── */}
                {loading ? (
                    
                    /* Skeleton Loader */
                    <Stack spacing={1.5}>
                        {[1, 2, 3].map((item) => (
                            <Stack key={item} spacing={1}>
                                <Skeleton 
                                    height={52} 
                                    sx={{ borderRadius: 2 }} 
                                />
                                {item < 3 && (
                                    <Skeleton 
                                        height={52} 
                                        sx={{ borderRadius: 2, ml: 5, width: "85%" }} 
                                    />
                                )}
                            </Stack>
                        ))}
                    </Stack>

                ) : menus.length === 0 ? (
                    
                    /* Empty State */
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            px: 4,
                        }}
                    >
                        <MenuBook
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
                            No menus found
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
                            Try adjusting your search or create a new menu to get started.
                        </Typography>
                    </Box>

                ) : (
                    <MenuTree
                        menus={menus}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onReorder={handleReorder}
                        canEdit={hasPermission("menu.edit")}
                        canDelete={hasPermission("menu.delete")}
                    />
                )}
            </Paper>

            {/* ── Dialogs ── */}
            <CreateMenuDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={loadMenus}
            />

            <EditMenuDialog
                open={openEdit}
                menuId={selectedMenuId}
                onClose={() => setOpenEdit(false)}
                onSuccess={loadMenus}
            />

            <DeleteMenuDialog
                open={openDelete}
                menuId={selectedMenu?.id}
                menuTitle={selectedMenu?.title}
                onClose={() => setOpenDelete(false)}
                onSuccess={loadMenus}
            />

        </Box>

    );

};

export default MenuList;