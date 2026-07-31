import api from "../api/axios";

export const getPages = async ({
    page = 1,
    search = "",
}) => {

    const { data } = await api.get("/pages", {
        params: {
            page,
            search,
        },
    });

    return data;

};

export const getPage = async (id) => {

    const { data } = await api.get(`/pages/${id}`);

    return data;

};

export const createPage = async (formData) => {

    const { data } = await api.post(
        "/pages",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;

};

export const updatePage = async (
    id,
    formData
) => {

    formData.append("_method", "PUT");

    const { data } = await api.post(
        `/pages/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;

};

export const deletePage = async (id) => {

    const { data } = await api.delete(`/pages/${id}`);

    return data;

};