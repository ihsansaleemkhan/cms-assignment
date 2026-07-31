import {
    Box,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    DataGrid,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RoleTable = ({
    roles,
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
            field: "name",
            headerName: "Role",
            flex: 1,
            minWidth: 220,
            renderCell: ({ value }) => (

                <Typography
                    fontWeight={600}
                >
                    {value}
                </Typography>

            ),
        },

        {
            field: "permissions",
            headerName: "Permissions",
            flex: 2,
            minWidth: 500,
            sortable: false,

            renderCell: ({ value }) => (

                <Stack
                    direction="row"
                    spacing={0.5}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{
                        py: 1,
                    }}
                >

                    {value?.map(permission => (

                        <Chip
                            key={permission}
                            label={permission}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />

                    ))}

                </Stack>

            ),
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 130,
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

            rows={roles}

            columns={columns}

            rowCount={totalRows}

            paginationMode="server"

            paginationModel={paginationModel}

            onPaginationModelChange={setPaginationModel}

            pageSizeOptions={[10]}

            disableRowSelectionOnClick

            getRowHeight={() => "auto"}

            sx={{

                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f7fb",
                    fontWeight: 700,
                },

                "& .MuiDataGrid-cell": {
                    alignItems: "center",
                    py: 1,
                },

                "& .MuiChip-root": {
                    borderRadius: 1,
                },

            }}

        />

    );

};

export default RoleTable;