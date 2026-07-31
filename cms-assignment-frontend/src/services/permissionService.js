import api from "../api/axios";

export const getPermissions = async () => {

    const { data } = await api.get("/permissions");

    return data;

};