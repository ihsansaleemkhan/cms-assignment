import {
    Box,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    SimpleTreeView,
    TreeItem,
} from "@mui/x-tree-view";

const MenuTree = ({
    menus,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
}) => {

    const renderNode = (menu) => (

        <TreeItem
            key={menu.id}
            itemId={String(menu.id)}
            label={

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        py: 0.5,
                        width: "100%",
                    }}
                >

                    <Stack spacing={0.5}>

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

                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >

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
                            label={`Order ${menu.sort_order}`}
                            variant="outlined"
                        />

                        {canEdit && (

                            <Tooltip title="Edit">

                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={(e) => {

                                        e.stopPropagation();

                                        onEdit(menu.id);

                                    }}
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
                                    onClick={(e) => {

                                        e.stopPropagation();

                                        onDelete(menu.id);

                                    }}
                                >

                                    <DeleteIcon fontSize="small" />

                                </IconButton>

                            </Tooltip>

                        )}

                    </Stack>

                </Stack>

            }

        >

            {menu.children?.map(renderNode)}

        </TreeItem>

    );

    return (

        <Box>

            <SimpleTreeView>

                {menus
                    .filter(menu => menu.parent_id === null)
                    .map(renderNode)}

            </SimpleTreeView>

        </Box>

    );

};

export default MenuTree;