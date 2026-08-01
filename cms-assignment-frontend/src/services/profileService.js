import api from "../api/axios";

export const getProfile = async () => {

    const { data } = await api.get("/me");

    return data.data;

};