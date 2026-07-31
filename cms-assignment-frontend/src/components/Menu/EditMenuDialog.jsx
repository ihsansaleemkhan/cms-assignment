import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Box,
} from "@mui/material";

import { toast } from "react-toastify";

import MenuForm from "./MenuForm";

import {
    getMenu,
    getAllMenus,
    updateMenu,
} from "../../services/menuService";

const EditMenuDialog = ({
    open,
    menuId,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [fetching, setFetching] = useState(false);

    const [menu, setMenu] = useState(null);

    const [menus, setMenus] = useState([]);

    useEffect(() => {

        if (!open || !menuId) return;

        loadData();

    }, [open, menuId]);

    const loadData = async () => {

        try {

            setFetching(true);

            const [menuResponse, allMenus] = await Promise.all([
                getMenu(menuId),
                getAllMenus(),
            ]);

            setMenu(menuResponse.data);

            // Prevent selecting itself as parent
            setMenus(
                allMenus.filter(
                    (item) => item.id !== menuId
                )
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load menu."
            );

        } finally {

            setFetching(false);

        }

    };

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            await updateMenu(menuId, data);

            toast.success("Menu updated successfully.");

            onSuccess();

            handleClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to update menu."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleClose = () => {

        setMenu(null);

        setMenus([]);

        onClose();

    };

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Edit Menu
            </DialogTitle>

            <DialogContent dividers>

                {fetching ? (

                    <Box
                        display="flex"
                        justifyContent="center"
                        py={4}
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <MenuForm
                        defaultValues={menu}
                        menus={menus}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancel={handleClose}
                    />

                )}

            </DialogContent>

        </Dialog>

    );

};

export default EditMenuDialog;