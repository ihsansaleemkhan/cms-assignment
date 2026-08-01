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
    People,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import usePermissions from "../../hooks/usePermissions";

import {
    getUsers,
} from "../../services/userService";

import UserTable from "../../components/Users/UserTable";
import CreateUserDialog from "../../components/Users/CreateUserDialog";
import EditUserDialog from "../../components/Users/EditUserDialog";
import DeleteUserDialog from "../../components/Users/DeleteUserDialog";

const UserList = () => {

    const { hasPermission } = usePermissions();

    const [users, setUsers] = useState([]);

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

    const [selectedUserId, setSelectedUserId] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {

        try {

            setLoading(true);

            const response = await getUsers({
                page: paginationModel.page + 1,
                search,
            });

            setUsers(response.data);

            setTotalRows(response.meta.total);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        loadUsers();
    }, [paginationModel.page, search]);

    const handleEdit = (id) => {
        setSelectedUserId(id);
        setOpenEdit(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
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
                            User Management
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
                        Manage user accounts and access levels.
                    </Typography>
                </Box>

                {hasPermission("user.create") && (
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
                        Create User
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
                    placeholder="Search users..."
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

                    /* Structural Table Skeleton (with Avatars) */
                    <Box>
                        {/* Fake Header Row */}
                        <Stack direction="row" spacing={2} mb={2}>
                            {[10, 25, 25, 20, 20].map((w, i) => (
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
                                <Skeleton 
                                    width={40} 
                                    height={40} 
                                    sx={{ borderRadius: "50%" }} 
                                />
                                <Skeleton width="25%" height={16} />
                                <Skeleton width="20%" height={16} />
                                <Skeleton width="15%" height={16} />
                                <Skeleton 
                                    width={80} 
                                    height={32} 
                                    sx={{ borderRadius: 1.5, ml: "auto" }} 
                                />
                            </Stack>
                        ))}
                    </Box>

                ) : users.length === 0 ? (

                    /* Empty State */
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            px: 4,
                        }}
                    >
                        <People
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
                            No users found
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
                            Try adjusting your search or create a new user to get started.
                        </Typography>
                    </Box>

                ) : (
                    <UserTable
                        users={users}
                        totalRows={totalRows}
                        paginationModel={paginationModel}
                        setPaginationModel={setPaginationModel}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={hasPermission("user.edit")}
                        canDelete={hasPermission("user.delete")}
                    />
                )}
            </Paper>

            {/* ── Dialogs ── */}
            <CreateUserDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={loadUsers}
            />

            <EditUserDialog
                open={openEdit}
                userId={selectedUserId}
                onClose={() => setOpenEdit(false)}
                onSuccess={loadUsers}
            />

            <DeleteUserDialog
                open={openDelete}
                user={selectedUser}
                onClose={() => setOpenDelete(false)}
                onSuccess={loadUsers}
            />

        </Box>

    );

};

export default UserList;