import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { toast } from "react-toastify";

import usePermissions from "../../hooks/usePermissions";

import {
    getRoles,
} from "../../services/roleService";

import RoleTable from "../../components/Roles/RoleTable";

import CreateRoleDialog from "../../components/Roles/CreateRoleDialog";
import EditRoleDialog from "../../components/Roles/EditRoleDialog";
import DeleteRoleDialog from "../../components/Roles/DeleteRoleDialog";

const RoleList = () => {

    const { hasPermission } = usePermissions();

    const [roles, setRoles] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [totalRows, setTotalRows] = useState(0);

    const [openCreate, setOpenCreate] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [selectedRoleId, setSelectedRoleId] = useState(null);

    const [selectedRole, setSelectedRole] = useState(null);

    const loadRoles = async () => {

        try {

            setLoading(true);

            const response = await getRoles({

                page: paginationModel.page + 1,

                search,

            });

            setRoles(response.data);

            setTotalRows(response.meta.total);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load roles."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadRoles();

    }, [paginationModel.page, search]);

    const handleEdit = (id) => {

        setSelectedRoleId(id);

        setOpenEdit(true);

    };

    const handleDelete = (role) => {

        setSelectedRole(role);

        setOpenDelete(true);

    };

    return (

        <Box>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography variant="h4">

                    Role Management

                </Typography>

                {hasPermission("role.create") && (

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreate(true)}
                    >

                        Create Role

                    </Button>

                )}

            </Stack>

            <Paper sx={{ p: 2 }}>

                <TextField
                    fullWidth
                    label="Search..."
                    value={search}
                    sx={{ mb: 2 }}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                {loading ? (

                    <>
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                    </>

                ) : roles.length === 0 ? (

                    <Alert severity="info">

                        No roles found.

                    </Alert>

                ) : (

                    <RoleTable
                        roles={roles}
                        totalRows={totalRows}
                        paginationModel={paginationModel}
                        setPaginationModel={setPaginationModel}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={hasPermission("role.edit")}
                        canDelete={hasPermission("role.delete")}
                    />

                )}

            </Paper>

            <CreateRoleDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={loadRoles}
            />

            <EditRoleDialog
                open={openEdit}
                roleId={selectedRoleId}
                onClose={() => setOpenEdit(false)}
                onSuccess={loadRoles}
            />

            <DeleteRoleDialog
                open={openDelete}
                role={selectedRole}
                onClose={() => setOpenDelete(false)}
                onSuccess={loadRoles}
            />

        </Box>

    );

};

export default RoleList;