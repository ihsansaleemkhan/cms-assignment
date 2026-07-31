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

const PageTable = ({
    pages,
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
            field: "cover_image",
            headerName: "Image",
            width: 90,
            sortable: false,

            renderCell: (params) => (

                <Avatar
                    variant="rounded"
                    src={params.value}
                    sx={{
                        width: 50,
                        height: 50,
                    }}
                />

            ),
        },

        {
            field: "title",
            headerName: "Title",
            flex: 1,
            minWidth: 220,
        },

        {
            field: "menu",
            headerName: "Menu",
            width: 180,

            renderCell: ({ row }) => row.menu?.title ?? "-",

        },

        {
            field: "status",
            headerName: "Status",
            width: 130,

            renderCell: ({ value }) => (

                <Chip
                    size="small"
                    label={value}
                    color={
                        value === "published"
                            ? "success"
                            : "default"
                    }
                />

            ),
        },

        {
            field: "publish_date",
            headerName: "Publish Date",
            width: 190,

            renderCell: ({ value }) => {

                if (!value) return "-";

                return new Date(value)
                    .toLocaleString();

            },
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
                                onClick={() =>
                                    onEdit(row.id)
                                }
                            >

                                <EditIcon />

                            </IconButton>

                        </Tooltip>

                    )}

                    {canDelete && (

                        <Tooltip title="Delete">

                            <IconButton
                                color="error"
                                onClick={() =>
                                    onDelete(row)
                                }
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

            rows={pages}

            columns={columns}

            rowCount={totalRows}

            paginationMode="server"

            paginationModel={paginationModel}

            onPaginationModelChange={setPaginationModel}

            pageSizeOptions={[10]}

            disableRowSelectionOnClick

        />

    );

};

export default PageTable;