import {
    Avatar,
    Box,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

const formatDateTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString();
};

const MenuTrashTable = ({
    menus = [],
    totalRows = 0,
    paginationModel,
    setPaginationModel,
    onRestore,
    onForceDelete,
    canRestore = false,
    canForceDelete = false,
}) => {

    const columns = [
        {
            field: "menu_icon",
            headerName: "",
            width: 70,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: "center",

            renderCell: () => (
                <Avatar
                    variant="rounded"
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        bgcolor: "rgba(25,118,210,0.08)",
                        color: "primary.main",
                        border: "1px solid",
                        borderColor: "rgba(25,118,210,0.12)",
                    }}
                >
                    <MenuBookOutlinedIcon
                        sx={{ fontSize: 21 }}
                    />
                </Avatar>
            ),
        },

        {
            field: "title",
            headerName: "Menu",
            flex: 1,
            minWidth: 240,

            renderCell: ({ row }) => (
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "text.primary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {row.title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        /{row.slug}
                    </Typography>
                </Box>
            ),
        },

        {
            field: "parent_id",
            headerName: "Parent",
            width: 130,

            renderCell: ({ row }) => (
                <Typography
                    sx={{
                        fontSize: 13.5,
                        color: "text.secondary",
                    }}
                >
                    {row.parent_id
                        ? `Menu #${row.parent_id}`
                        : "Root Menu"}
                </Typography>
            ),
        },

        {
            field: "sort_order",
            headerName: "Order",
            width: 90,
            align: "center",
            headerAlign: "center",

            renderCell: ({ value }) => (
                <Chip
                    label={value ?? 0}
                    size="small"
                    variant="outlined"
                    sx={{
                        minWidth: 38,
                        fontSize: 12,
                        fontWeight: 700,
                        borderColor: "#d8dce2",
                        bgcolor: "#fafafa",
                    }}
                />
            ),
        },

        {
            field: "is_active",
            headerName: "Status",
            width: 115,

            renderCell: ({ value }) => (
                <Chip
                    size="small"
                    label={value ? "Active" : "Inactive"}
                    color={value ? "success" : "default"}
                    variant={value ? "filled" : "outlined"}
                    sx={{
                        fontWeight: 600,
                        fontSize: 11.5,
                    }}
                />
            ),
        },

        {
            field: "deleted_by",
            headerName: "Deleted By",
            width: 220,
            sortable: false,

            renderCell: ({ row }) => (
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ minWidth: 0 }}
                >
                    <Avatar
                        sx={{
                            width: 30,
                            height: 30,
                            bgcolor: "#eef3fb",
                            color: "primary.main",
                        }}
                    >
                        <PersonOutlineIcon
                            sx={{ fontSize: 17 }}
                        />
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {row.deleted_by?.name ?? "-"}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11.5,
                                color: "text.secondary",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {row.deleted_by?.email ?? ""}
                        </Typography>
                    </Box>
                </Stack>
            ),
        },

        {
            field: "deleted_at",
            headerName: "Deleted Date",
            width: 190,

            renderCell: ({ value }) => (
                <Typography
                    sx={{
                        fontSize: 13,
                        color: "text.secondary",
                    }}
                >
                    {formatDateTime(value)}
                </Typography>
            ),
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 125,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: "center",

            renderCell: ({ row }) => (
                <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={0.5}
                >
                    {canRestore && (
                        <Tooltip title="Restore menu">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onRestore(row)}
                                sx={{
                                    bgcolor: "rgba(25,118,210,0.06)",
                                    "&:hover": {
                                        bgcolor: "rgba(25,118,210,0.14)",
                                    },
                                }}
                            >
                                <RestoreIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {canForceDelete && (
                        <Tooltip title="Delete permanently">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                    onForceDelete(row)
                                }
                                sx={{
                                    bgcolor: "rgba(211,47,47,0.06)",
                                    "&:hover": {
                                        bgcolor: "rgba(211,47,47,0.14)",
                                    },
                                }}
                            >
                                <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            ),
        },
    ];

    return (
        <DataGrid
            autoHeight
            rows={menus}
            columns={columns}
            rowCount={totalRows}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            rowHeight={68}
            columnHeaderHeight={52}
            sx={{
                border: "none",

                "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#f8f9fc",
                    borderBottom: "1px solid #e5e7eb",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 700,
                    fontSize: 12.5,
                    color: "text.secondary",
                },

                "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f1f3",
                },

                "& .MuiDataGrid-row:hover": {
                    bgcolor: "#fafbfc",
                },

                "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #e5e7eb",
                    minHeight: 58,
                },
            }}
        />
    );
};

export default MenuTrashTable;