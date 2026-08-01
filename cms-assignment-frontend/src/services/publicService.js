import api from "../api/axios";

export const getPublicMenus = async () => {
    const { data } = await api.get("/public/menus");

    return data;
};

export const getPublicPages = async ({
    page = 1,
    search = "",
    menu_id = "",
} = {}) => {
    const { data } = await api.get("/public/pages", {
        params: {
            page,
            search,
            menu_id,
        },
    });

    return data;
};

export const getPublicPageBySlug = async (slug) => {
    const { data } = await api.get(
        `/public/pages/${slug}`
    );

    return data;
};