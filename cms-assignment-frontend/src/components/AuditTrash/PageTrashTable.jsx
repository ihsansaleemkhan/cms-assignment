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

const formatDateTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString();
};

const PageTrashTable = ({
    pages = [],
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
            field: "cover_image",
            headerName: "Image",
            width: 82,
            sortable: false,
            filterable: false,

            renderCell: ({ value, row }) => (
                <Avatar
                    variant="rounded"
                    src={value || undefined}
                    alt={row.title}
                    sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 2,
                        bgcolor: "#f1f3f5",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {row.title?.charAt(0)?.toUpperCase()}
                </Avatar>
            ),
        },

        {
            field: "title",
            headerName: "Page",
            flex: 1,
            minWidth: 220,

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
            field: "menu",
            headerName: "Menu",
            width: 170,

            renderCell: ({ row }) => (
                <Typography
                    sx={{
                        fontSize: 13.5,
                        color: "text.secondary",
                    }}
                >
                    {row.menu?.title ?? "-"}
                </Typography>
            ),
        },

        {
            field: "status",
            headerName: "Status",
            width: 125,

            renderCell: ({ value }) => (
                <Chip
                    size="small"
                    label={value ?? "-"}
                    color={
                        value === "published"
                            ? "success"
                            : "default"
                    }
                    variant={
                        value === "published"
                            ? "filled"
                            : "outlined"
                    }
                    sx={{
                        textTransform: "capitalize",
                        fontWeight: 600,
                        fontSize: 11.5,
                    }}
                />
            ),
        },

        {
            field: "deleted_by",
            headerName: "Deleted By",
            width: 210,
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
                        <Tooltip title="Restore page">
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
            rows={pages}
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

export default PageTrashTable;