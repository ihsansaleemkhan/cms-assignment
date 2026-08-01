import {
    Avatar,
    Box,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    alpha,
} from "@mui/material";

import {
    DataGrid,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TranslateIcon from "@mui/icons-material/Translate";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const PageTable = ({
    pages = [],
    totalRows = 0,
    paginationModel,
    setPaginationModel,
    onEdit,
    onDelete,
    canEdit = false,
    canDelete = false,
}) => {

    const columns = [

        {
            field: "cover_image",
            headerName: "Image",
            width: 90,
            sortable: false,
            filterable: false,

            renderCell: ({ row }) => (

                <Avatar
                    variant="rounded"
                    src={row.cover_image || undefined}
                    alt={row.title}
                    sx={{
                        width: 52,
                        height: 52,
                        bgcolor: alpha("#1976d2", 0.08),
                        color: "primary.main",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {!row.cover_image && (
                        <DescriptionOutlinedIcon />
                    )}
                </Avatar>

            ),
        },

        {
            field: "title",
            headerName: "Page Title",
            flex: 1,
            minWidth: 260,
            sortable: true,

            renderCell: ({ row }) => (

                <Box
                    sx={{
                        minWidth: 0,
                        width: "100%",
                    }}
                >

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

                    {row.title_ar && (

                        <Stack
                            direction="row"
                            spacing={0.65}
                            alignItems="center"
                            sx={{
                                mt: 0.45,
                                minWidth: 0,
                            }}
                        >

                            <TranslateIcon
                                sx={{
                                    fontSize: 14,
                                    color: "primary.main",
                                    flexShrink: 0,
                                }}
                            />

                            <Typography
                                dir="rtl"
                                sx={{
                                    minWidth: 0,
                                    fontSize: 12.5,
                                    color: "text.secondary",
                                    fontFamily:
                                        "'Noto Sans Arabic', Arial, sans-serif",
                                    textAlign: "left",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {row.title_ar}
                            </Typography>

                        </Stack>

                    )}

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 0.3,
                            color: "text.disabled",
                            fontFamily:
                                "'JetBrains Mono', 'Fira Code', monospace",
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
            width: 210,
            sortable: false,

            renderCell: ({ row }) => (

                <Box
                    sx={{
                        minWidth: 0,
                        width: "100%",
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "text.primary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {row.menu?.title ?? "-"}
                    </Typography>

                    {row.menu?.title_ar && (

                        <Typography
                            dir="rtl"
                            sx={{
                                mt: 0.35,
                                fontSize: 12,
                                color: "text.secondary",
                                textAlign: "left",
                                fontFamily:
                                    "'Noto Sans Arabic', Arial, sans-serif",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {row.menu.title_ar}
                        </Typography>

                    )}

                </Box>

            ),
        },

        {
            field: "language",
            headerName: "Languages",
            width: 120,
            sortable: false,
            filterable: false,

            renderCell: ({ row }) => (

                <Stack
                    direction="row"
                    spacing={0.75}
                    flexWrap="wrap"
                    useFlexGap
                >

                    <Chip
                        size="small"
                        label="EN"
                        color="primary"
                        variant="outlined"
                        sx={{
                            height: 24,
                            fontSize: 10.5,
                            fontWeight: 800,
                        }}
                    />

                    {row.title_ar || row.body_ar ? (

                        <Chip
                            size="small"
                            label="AR"
                            color="success"
                            variant="outlined"
                            sx={{
                                height: 24,
                                fontSize: 10.5,
                                fontWeight: 800,
                            }}
                        />

                    ) : (

                        <Tooltip title="Arabic translation is not available">

                            <Chip
                                size="small"
                                label="AR"
                                disabled
                                variant="outlined"
                                sx={{
                                    height: 24,
                                    fontSize: 10.5,
                                    fontWeight: 800,
                                }}
                            />

                        </Tooltip>

                    )}

                </Stack>

            ),
        },

        {
            field: "status",
            headerName: "Status",
            width: 130,

            renderCell: ({ value }) => (

                <Chip
                    size="small"
                    label={
                        value
                            ? value.charAt(0).toUpperCase() +
                              value.slice(1)
                            : "-"
                    }
                    color={
                        value === "published"
                            ? "success"
                            : "default"
                    }
                    sx={{
                        fontWeight: 700,
                    }}
                />

            ),
        },

        {
            field: "publish_date",
            headerName: "Publish Date",
            width: 190,

            renderCell: ({ value }) => {

                if (!value) {
                    return (
                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "text.disabled",
                            }}
                        >
                            Not scheduled
                        </Typography>
                    );
                }

                const date = new Date(value);

                if (Number.isNaN(date.getTime())) {
                    return "-";
                }

                return (
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "text.secondary",
                        }}
                    >
                        {date.toLocaleString()}
                    </Typography>
                );

            },
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: "center",

            renderCell: ({ row }) => (

                <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="center"
                >

                    {canEdit && (

                        <Tooltip title="Edit page">

                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                    onEdit(row.id)
                                }
                                sx={{
                                    bgcolor: alpha(
                                        "#1976d2",
                                        0.06
                                    ),

                                    "&:hover": {
                                        bgcolor: alpha(
                                            "#1976d2",
                                            0.14
                                        ),
                                    },
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>

                        </Tooltip>

                    )}

                    {canDelete && (

                        <Tooltip title="Delete page">

                            <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                    onDelete(row)
                                }
                                sx={{
                                    bgcolor: alpha(
                                        "#d32f2f",
                                        0.06
                                    ),

                                    "&:hover": {
                                        bgcolor: alpha(
                                            "#d32f2f",
                                            0.14
                                        ),
                                    },
                                }}
                            >
                                <DeleteIcon fontSize="small" />
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
            onPaginationModelChange={
                setPaginationModel
            }
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            getRowHeight={() => 82}
            sx={{
                border: 0,

                "& .MuiDataGrid-columnHeaders": {
                    bgcolor: alpha("#1976d2", 0.035),
                    borderBottom: "1px solid",
                    borderColor: "divider",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 700,
                    fontSize: 13,
                },

                "& .MuiDataGrid-cell": {
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid",
                    borderColor: alpha("#000", 0.06),
                },

                "& .MuiDataGrid-row:hover": {
                    bgcolor: alpha("#1976d2", 0.025),
                },

                "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid",
                    borderColor: "divider",
                },
            }}
        />

    );

};

export default PageTable;