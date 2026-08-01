import { Navigate } from "react-router-dom";
import usePermissions from "../../hooks/usePermissions";

const PermissionRoute = ({
    permission,
    children,
}) => {

    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
        return <Navigate to="/403" replace />;
    }

    return children;
};

export default PermissionRoute;