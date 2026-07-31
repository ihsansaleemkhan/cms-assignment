import api from "../api/axios";

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

export const getUsers = async ({
    page = 1,
    search = "",
}) => {

    const { data } = await api.get("/users", {
        params: {
            page,
            search,
        },
    });

    return data;
};

export const getUser = async (id) => {

    const { data } = await api.get(`/users/${id}`);

    return data;
};

export const createUser = async (payload) => {

    const { data } = await api.post(
        "/users",
        payload
    );

    return data;
};

export const updateUser = async (
    id,
    payload
) => {

    const { data } = await api.put(
        `/users/${id}`,
        payload
    );

    return data;
};

export const deleteUser = async (id) => {

    const { data } = await api.delete(
        `/users/${id}`
    );

    return data;
};

/*
|--------------------------------------------------------------------------
| Roles
|--------------------------------------------------------------------------
*/

export const getRoles = async () => {

    const { data } = await api.get("/roles");

    return data.data;
};