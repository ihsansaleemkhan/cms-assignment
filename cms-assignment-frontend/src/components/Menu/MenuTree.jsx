import {
    Box,
    CircularProgress,
    Stack,
} from "@mui/material";

import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import {
    useEffect,
    useState,
} from "react";

import SortableMenuItem from "./SortableMenuItem";

const MenuTree = ({
    menus = [],
    loading = false,
    onEdit,
    onDelete,
    onReorder,
    canEdit = false,
    canDelete = false,
}) => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(menus);
    }, [menus]);

    const handleDragEnd = ({
        active,
        over,
    }) => {

        if (
            !over ||
            active.id === over.id
        ) {
            return;
        }

        const oldIndex = items.findIndex(
            (item) => item.id === active.id
        );

        const newIndex = items.findIndex(
            (item) => item.id === over.id
        );

        /*
         * Top-level MenuTree only reorders root menus.
         * Child items are rendered recursively inside SortableMenuItem.
         */
        if (
            oldIndex === -1 ||
            newIndex === -1
        ) {
            return;
        }

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
                items={items.map(
                    (item) => item.id
                )}
                strategy={
                    verticalListSortingStrategy
                }
            >

                <Stack spacing={2}>

                    {items.map((menu) => (

                        <SortableMenuItem
                            key={menu.id}
                            menu={menu}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            canEdit={canEdit}
                            canDelete={canDelete}
                        />

                    ))}

                </Stack>

            </SortableContext>

        </DndContext>

    );

};

export default MenuTree;