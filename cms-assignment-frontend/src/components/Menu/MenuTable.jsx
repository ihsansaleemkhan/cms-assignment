import {
    DataGrid,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";

const MenuTable = ({
    rows,
    rowCount,
    loading,
    paginationModel,
    onPaginationModelChange,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
}) => {

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 80,
        },
        {
            field: "title",
            headerName: "Title",
            flex: 1,
        },
        {
            field: "slug",
            headerName: "Slug",
            flex: 1,
        },
        {
            field: "sort_order",
            headerName: "Order",
            width: 100,
        },
        {
            field: "is_active",
            headerName: "Status",
            width: 120,
            renderCell: (params) =>
                params.value ? "Active" : "Inactive",
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <>
                    {canEdit && (
                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                onClick={() => onEdit(params.row.id)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {canDelete && (
                        <Tooltip title="Delete">
                            <IconButton
                                color="error"
                                onClick={() => onDelete(params.row.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            ),
        },
    ];

    return (
        <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
        />
    );
};

export default MenuTable;