import {
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import { useEffect, useState } from "react";

import SortableMenuItem from "./SortableMenuItem";

const MenuTree = ({
    menus,
    loading,
    onEdit,
    onDelete,
    onReorder,
    canEdit,
    canDelete,
}) => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(menus);
    }, [menus]);

    const handleDragEnd = ({ active, over }) => {

        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex(
            item => item.id === active.id
        );

        const newIndex = items.findIndex(
            item => item.id === over.id
        );

        const newItems = arrayMove(
            items,
            oldIndex,
            newIndex
        );

        setItems(newItems);

        if (onReorder) {
            onReorder(newItems);
        }
    };

    const renderChildren = (children = []) => {

        if (!children.length) return null;

        return (
            <Box
                sx={{
                    ml: 5,
                    mt: 1,
                }}
            >
                {children.map(child => (

                    <Box
                        key={child.id}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 1,
                            borderBottom: "1px dashed #eee",
                        }}
                    >

                        <Stack spacing={0.5}>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {child.title}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {child.slug}
                            </Typography>

                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >

                            <Chip
                                size="small"
                                label={
                                    child.is_active
                                        ? "Active"
                                        : "Inactive"
                                }
                                color={
                                    child.is_active
                                        ? "success"
                                        : "default"
                                }
                            />

                            {canEdit && (
                                <Tooltip title="Edit">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => onEdit(child.id)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {canDelete && (
                                <Tooltip title="Delete">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onDelete(child)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}

                        </Stack>

                    </Box>

                ))}
            </Box>
        );
    };

    if (loading) {

        return (
            <Box
                py={6}
                display="flex"
                justifyContent="center"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (

        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >

            <SortableContext
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
            >

                <Stack spacing={2}>

                    {items.map(menu => (

                        <Box key={menu.id}>

                            <SortableMenuItem
                                menu={menu}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                canEdit={canEdit}
                                canDelete={canDelete}
                            />

                            {renderChildren(menu.children)}

                        </Box>

                    ))}

                </Stack>

            </SortableContext>

        </DndContext>

    );

};

export default MenuTree;