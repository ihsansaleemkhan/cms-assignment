import {
    Box,
    Chip,
    Collapse,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    alpha,
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TranslateIcon from "@mui/icons-material/Translate";

import {
    useState,
} from "react";

import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
    CSS,
} from "@dnd-kit/utilities";

const SortableMenuItem = ({
    menu,
    onEdit,
    onDelete,
    canEdit = false,
    canDelete = false,
}) => {

    const [expanded, setExpanded] = useState(true);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: menu.id,
    });

    const style = {
        transform:
            CSS.Transform.toString(transform),
        transition,
        opacity: isDragging
            ? 0.5
            : 1,
    };

    const hasChildren =
        Boolean(menu.children?.length);

    return (

        <Box
            ref={setNodeRef}
            style={style}
            sx={{
                mb: 1,
            }}
        >

            <Box
                sx={{
                    border: "1px solid",
                    borderColor: isDragging
                        ? "primary.main"
                        : "divider",
                    borderRadius: 2.5,
                    p: 1.5,
                    bgcolor: "background.paper",
                    boxShadow: isDragging
                        ? "0 8px 24px rgba(25,118,210,0.16)"
                        : "none",
                    transition: "all 0.2s ease",
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                    spacing={1.25}
                >

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "auto",
                            },
                        }}
                    >

                        {hasChildren ? (

                            <IconButton
                                size="small"
                                onClick={() =>
                                    setExpanded(
                                        (value) =>
                                            !value
                                    )
                                }
                                aria-label={
                                    expanded
                                        ? "Collapse children"
                                        : "Expand children"
                                }
                            >

                                {expanded ? (
                                    <ExpandMoreIcon />
                                ) : (
                                    <ChevronRightIcon />
                                )}

                            </IconButton>

                        ) : (

                            <Box
                                sx={{
                                    width: 40,
                                    flexShrink: 0,
                                }}
                            />

                        )}

                        <FolderIcon color="primary" />

                        <Box
                            {...attributes}
                            {...listeners}
                            sx={{
                                cursor: isDragging
                                    ? "grabbing"
                                    : "grab",
                                display: "flex",
                                alignItems: "center",
                                color: "text.secondary",
                                touchAction: "none",
                            }}
                        >
                            <DragIndicatorIcon />
                        </Box>

                    </Stack>

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            width: "100%",
                        }}
                    >

                        <Typography
                            fontWeight={700}
                            sx={{
                                color: "text.primary",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {menu.title}
                        </Typography>

                        {menu.title_ar && (

                            <Stack
                                direction="row"
                                spacing={0.75}
                                alignItems="center"
                                sx={{
                                    mt: 0.35,
                                }}
                            >

                                <TranslateIcon
                                    sx={{
                                        fontSize: 15,
                                        color: "primary.main",
                                    }}
                                />

                                <Typography
                                    dir="rtl"
                                    sx={{
                                        fontSize: 13,
                                        color: "text.secondary",
                                        fontFamily:
                                            "'Noto Sans Arabic', Arial, sans-serif",
                                        textAlign: "left",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {menu.title_ar}
                                </Typography>

                            </Stack>

                        )}

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mt: 0.35,
                                fontFamily:
                                    "'JetBrains Mono', monospace",
                            }}
                        >
                            /{menu.slug}
                        </Typography>

                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "auto",
                            },
                            justifyContent: {
                                xs: "flex-end",
                                sm: "flex-start",
                            },
                        }}
                    >

                        {menu.title_ar && (

                            <Chip
                                size="small"
                                label="Arabic"
                                variant="outlined"
                                color="primary"
                                icon={
                                    <TranslateIcon
                                        sx={{
                                            fontSize:
                                                "15px !important",
                                        }}
                                    />
                                }
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 10.5,
                                }}
                            />

                        )}

                        <Chip
                            size="small"
                            label={
                                menu.is_active
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                menu.is_active
                                    ? "success"
                                    : "default"
                            }
                            sx={{
                                fontWeight: 600,
                            }}
                        />

                        <Chip
                            size="small"
                            variant="outlined"
                            label={`#${menu.sort_order}`}
                            sx={{
                                fontWeight: 700,
                            }}
                        />

                        {canEdit && (

                            <Tooltip title="Edit">

                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                        onEdit(menu.id)
                                    }
                                    sx={{
                                        bgcolor:
                                            alpha(
                                                "#1976d2",
                                                0.05
                                            ),

                                        "&:hover": {
                                            bgcolor:
                                                alpha(
                                                    "#1976d2",
                                                    0.12
                                                ),
                                        },
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>

                            </Tooltip>

                        )}

                        {canDelete && (

                            <Tooltip title="Delete">

                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                        onDelete(menu)
                                    }
                                    sx={{
                                        bgcolor:
                                            alpha(
                                                "#d32f2f",
                                                0.05
                                            ),

                                        "&:hover": {
                                            bgcolor:
                                                alpha(
                                                    "#d32f2f",
                                                    0.12
                                                ),
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>

                            </Tooltip>

                        )}

                    </Stack>

                </Stack>

            </Box>

            {hasChildren && (

                <Collapse
                    in={expanded}
                    timeout="auto"
                    unmountOnExit
                >

                    <Box
                        sx={{
                            ml: {
                                xs: 2,
                                sm: 5,
                            },
                            mt: 1,
                            pl: {
                                xs: 1,
                                sm: 2,
                            },
                            borderLeft: "2px solid",
                            borderColor:
                                alpha(
                                    "#1976d2",
                                    0.12
                                ),
                        }}
                    >

                        <SortableContext
                            items={menu.children.map(
                                (child) => child.id
                            )}
                            strategy={
                                verticalListSortingStrategy
                            }
                        >

                            {menu.children.map(
                                (child) => (

                                    <SortableMenuItem
                                        key={child.id}
                                        menu={child}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        canEdit={canEdit}
                                        canDelete={canDelete}
                                    />

                                )
                            )}

                        </SortableContext>

                    </Box>

                </Collapse>

            )}

        </Box>

    );

};

export default SortableMenuItem;