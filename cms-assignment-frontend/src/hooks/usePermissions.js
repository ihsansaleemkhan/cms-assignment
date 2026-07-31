import { useSelector } from "react-redux";

const usePermissions = () => {

    const user = useSelector(
        (state) => state.auth.user
    );

    const permissions = user?.permissions || [];

    const hasPermission = (permission) =>
        permissions.includes(permission);

    return {
        hasPermission,
    };

};

export default usePermissions;