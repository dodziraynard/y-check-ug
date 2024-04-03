import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Error401Screen from "../../pages/ErrorPages/401";
import {
    useLazyGetConfigurationsQuery,
} from '../../features/resources/resources-api-slice';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigurations } from '../../features/global/global-slice';


const ProtectedRoute = ({ children, permissions = [] }) => {
    const user = useSelector((state) => state.authentication.user);
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const hasPermission = permissions.every((permission) => userPermissions.has(permission));

    const [getConfigurations, { error }] = useLazyGetConfigurationsQuery()
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const response = await getConfigurations().unwrap()
            if (response?.configurations) {
                dispatch(setConfigurations(response.configurations))
            }
        })()
    }, [])

    if (!hasPermission)
        return <Error401Screen />
    return Boolean(user?.username) ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
