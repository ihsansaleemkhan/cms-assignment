import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Stack,
    Skeleton,
    Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import MenuTree from "../../components/Menu/MenuTree";

import { getMenus } from "../../services/menuService";

import usePermissions from "../../hooks/usePermissions";

import CreateMenuDialog from "../../components/Menu/CreateMenuDialog";

import EditMenuDialog from "../../components/Menu/EditMenuDialog";

import DeleteMenuDialog from "../../components/Menu/DeleteMenuDialog";

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

    useEffect(() => {

        loadMenus();

    }, [paginationModel, search]);

    return (

        <Box>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography variant="h4">
                    Menu Management
                </Typography>

                {hasPermission("menu.create") && (

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreate(true)}
                    >
                        Create Menu
                    </Button>

                )}

            </Stack>

            <Paper sx={{ p: 2 }}>

                <TextField
                    label="Search..."
                    fullWidth
                    sx={{ mb: 2 }}
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                {loading ? (
                    <>
                        <Skeleton height={55} />
                        <Skeleton height={55} />
                        <Skeleton height={55} />
                        <Skeleton height={55} />
                        <Skeleton height={55} />
                    </>
                ) : menus.length === 0 ? (
                    <Alert severity="info">
                        No menus found.
                    </Alert>
                ) : (
                    <MenuTree
                        menus={menus}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={hasPermission("menu.edit")}
                        canDelete={hasPermission("menu.delete")}
                    />
                )}

            </Paper>

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