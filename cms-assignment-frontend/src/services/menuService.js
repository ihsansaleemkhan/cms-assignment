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
    const { data } = await api.get("/menus", {
        params: {
            page: 1,
            per_page: 1000,
        },
    });

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