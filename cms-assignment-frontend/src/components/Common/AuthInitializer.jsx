import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { me } from "../../features/auth/authService";
import { setUser, logoutUser } from "../../features/auth/authSlice";

const AuthInitializer = ({ children }) => {

    const dispatch = useDispatch();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) return;

        const initialize = async () => {

            try {

                const response = await me();

                dispatch(setUser(response.data));

            } catch {

                dispatch(logoutUser());

            }

        };

        initialize();

    }, [dispatch]);

    return children;

};

export default AuthInitializer;