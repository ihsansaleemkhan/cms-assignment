import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";

import { toast } from "react-toastify";

import MenuForm from "./MenuForm";

import {
    createMenu,
    getAllMenus,
} from "../../services/menuService";

const CreateMenuDialog = ({
    open,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [menus, setMenus] = useState([]);

    useEffect(() => {

        if (open) {

            loadMenus();

        }

    }, [open]);

    const loadMenus = async () => {

        try {

            const menus = await getAllMenus();

            setMenus(menus);

        } catch {

            toast.error("Unable to load menu list.");

        }

    };

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            await createMenu(data);

            toast.success("Menu created successfully.");

            onSuccess();

            onClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to create menu."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Create Menu
            </DialogTitle>

            <DialogContent dividers>

                <MenuForm
                    defaultValues={{}}
                    menus={menus}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />

            </DialogContent>

        </Dialog>

    );

};

export default CreateMenuDialog;