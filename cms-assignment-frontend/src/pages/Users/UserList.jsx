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

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography variant="h4">

                    User Management

                </Typography>

                {hasPermission("user.create") && (

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreate(true)}
                    >

                        Create User

                    </Button>

                )}

            </Stack>

            <Paper sx={{ p: 2 }}>

                <TextField
                    fullWidth
                    label="Search users..."
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

                ) : users.length === 0 ? (

                    <Alert severity="info">

                        No users found.

                    </Alert>

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