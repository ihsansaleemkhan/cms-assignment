import api from "../api/axios";

export const getMenus = async ({
    page = 1,
    search = "",
}) => {

    const { data } = await api.get("/menus", {
        params: {
            page,
            search,
        },
    });

    return data;

};

export const getAllMenus = async () => {

    const { data } = await api.get("/menus/all");

    return data.data;

};

export const getMenu = async (id) => {

    const { data } = await api.get(`/menus/${id}`);

    return data;

};

export const createMenu = async (payload) => {

    const { data } = await api.post("/menus", payload);

    return data;

};

export const updateMenu = async (id, payload) => {

    const { data } = await api.put(`/menus/${id}`, payload);

    return data;

};

export const deleteMenu = async (id) => {

    const { data } = await api.delete(`/menus/${id}`);

    return data;

};

export const reorderMenus = async (payload) => {

    const { data } = await api.put("/menus/reorder", {
        menus: payload,
    });

    return data;

};

/*
|--------------------------------------------------------------------------
| Menu Trash
|--------------------------------------------------------------------------
*/

export const getDeletedMenus = async ({
    page = 1,
    search = "",
} = {}) => {
    const { data } = await api.get(
        "/menus/trash",
        {
            params: {
                page,
                search,
            },
        }
    );

    return data;
};

export const restoreMenu = async (id) => {
    const { data } = await api.post(
        `/menus/${id}/restore`
    );

    return data;
};

export const forceDeleteMenu = async (id) => {
    const { data } = await api.delete(
        `/menus/${id}/force-delete`
    );

    return data;
};