import api from "../../api/axios";

export const getMenus = async (page = 1) => {
    const { data } = await api.get(`/menus?page=${page}`);
    return data;
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