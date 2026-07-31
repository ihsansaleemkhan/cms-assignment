import {
    Avatar,
    Box,
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";

import {
    DataGrid,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

const UserTable = ({
    users,
    totalRows,
    paginationModel,
    setPaginationModel,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
}) => {

    const columns = [

        {
            field: "avatar",
            headerName: "",
            width: 80,
            sortable: false,
            filterable: false,

            renderCell: ({ row }) => (

                <Avatar
                    sx={{
                        bgcolor: "primary.main",
                        width: 40,
                        height: 40,
                    }}
                >
                    <PersonIcon />
                </Avatar>

            ),
        },

        {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 220,
        },

        {
            field: "email",
            headerName: "Email",
            flex: 1,
            minWidth: 260,
        },

        {
            field: "roles",
            headerName: "Role",
            width: 220,

            renderCell: ({ value }) => (

                value?.length ? (

                    <Chip
                        label={value[0]}
                        color="primary"
                        size="small"
                    />

                ) : "-"

            ),

        },

        {
            field: "permissions",
            headerName: "Permissions",
            width: 170,

            renderCell: ({ value }) => (

                <Chip
                    size="small"
                    color="secondary"
                    label={`${value?.length ?? 0} Permissions`}
                />

            ),

        },

        {
            field: "created_at",
            headerName: "Created",
            width: 180,

            renderCell: ({ value }) =>

                new Date(value).toLocaleDateString(),

        },

        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            sortable: false,
            filterable: false,

            renderCell: ({ row }) => (

                <Box>

                    {canEdit && (

                        <Tooltip title="Edit">

                            <IconButton
                                color="primary"
                                onClick={() => onEdit(row.id)}
                            >

                                <EditIcon />

                            </IconButton>

                        </Tooltip>

                    )}

                    {canDelete && (

                        <Tooltip title="Delete">

                            <IconButton
                                color="error"
                                onClick={() => onDelete(row)}
                            >

                                <DeleteIcon />

                            </IconButton>

                        </Tooltip>

                    )}

                </Box>

            ),

        },

    ];

    return (

        <DataGrid

            autoHeight

            rows={users}

            columns={columns}

            rowCount={totalRows}

            paginationMode="server"

            paginationModel={paginationModel}

            onPaginationModelChange={setPaginationModel}

            pageSizeOptions={[10]}

            disableRowSelectionOnClick

            sx={{
                border: 0,

                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8fafc",
                    fontWeight: 700,
                },

                "& .MuiDataGrid-cell": {
                    alignItems: "center",
                },

                "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f9fbff",
                },
            }}

        />

    );

};

export default UserTable;