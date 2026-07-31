import api from "../../api/axios";

export const login = async (credentials) => {
    const { data } = await api.post("/login", credentials);
    return data;
};

export const me = async () => {
    const { data } = await api.get("/me");
    return data;
};

export const logout = async () => {
    return api.post("/logout");
};