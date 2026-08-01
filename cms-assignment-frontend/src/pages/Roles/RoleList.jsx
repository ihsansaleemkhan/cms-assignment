import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography,
    InputAdornment,
    alpha,
} from "@mui/material";

import {
    Add,
    Search,
    Security,
} from "@mui/icons-material";

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
                            Role Management
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
                        Define user groups and their system permissions.
                    </Typography>
                </Box>

                {hasPermission("role.create") && (
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
                        Create Role
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
                    placeholder="Search roles..."
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

                    /* Structural Table Skeleton */
                    <Box>
                        {/* Fake Header Row */}
                        <Stack direction="row" spacing={2} mb={2}>
                            {[40, 30, 30].map((w, i) => (
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
                                <Skeleton width="30%" height={16} />
                                <Skeleton width="20%" height={16} />
                                <Skeleton
                                    width={80}
                                    height={32}
                                    sx={{ borderRadius: 1.5, ml: "auto" }}
                                />
                            </Stack>
                        ))}
                    </Box>

                ) : roles.length === 0 ? (

                    /* Empty State */
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            px: 4,
                        }}
                    >
                        <Security
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
                            No roles found
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
                            Try adjusting your search or create a new role to get started.
                        </Typography>
                    </Box>

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

            {/* ── Dialogs ── */}
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