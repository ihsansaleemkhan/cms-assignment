import {
    Box,
    Chip,
    Collapse,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";

import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const SortableMenuItem = ({
    menu,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
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
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

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
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 1.5,
                    bgcolor: "background.paper",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    {menu.children?.length > 0 ? (
                        <IconButton
                            size="small"
                            onClick={() =>
                                setExpanded(!expanded)
                            }
                        >
                            {expanded ? (
                                <ExpandMoreIcon />
                            ) : (
                                <ChevronRightIcon />
                            )}
                        </IconButton>
                    ) : (
                        <Box width={40} />
                    )}

                    <FolderIcon color="primary" />

                    <Box
                        {...attributes}
                        {...listeners}
                        sx={{
                            cursor: "grab",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <DragIndicatorIcon />
                    </Box>

                    <Box flex={1}>
                        <Typography
                            fontWeight={600}
                        >
                            {menu.title}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {menu.slug}
                        </Typography>
                    </Box>

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
                    />

                    <Chip
                        size="small"
                        variant="outlined"
                        label={`#${menu.sort_order}`}
                    />

                    {canEdit && (
                        <Tooltip title="Edit">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                    onEdit(menu.id)
                                }
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
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            </Box>

            {menu.children?.length > 0 && (
                <Collapse in={expanded}>
                    <Box
                        ml={5}
                        mt={1}
                    >
                        <SortableContext
                            items={menu.children.map(
                                c => c.id
                            )}
                            strategy={
                                verticalListSortingStrategy
                            }
                        >
                            {menu.children.map(child => (
                                <SortableMenuItem
                                    key={child.id}
                                    menu={child}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    canEdit={canEdit}
                                    canDelete={canDelete}
                                />
                            ))}
                        </SortableContext>
                    </Box>
                </Collapse>
            )}
        </Box>
    );
};

export default SortableMenuItem;