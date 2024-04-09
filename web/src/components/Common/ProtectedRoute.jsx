import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Error401Screen from "../../pages/ErrorPages/401";


const ProtectedRoute = ({ children, permissions = [] }) => {
    const user = useSelector((state) => state.authentication.user);
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const hasPermission = permissions.every((permission) => userPermissions.has(permission));

    if (!hasPermission)
        return <Error401Screen />
    return Boolean(user?.username) ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
