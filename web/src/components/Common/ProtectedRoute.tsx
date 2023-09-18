import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
// import { useSelector } from 'react-redux';
import Error401Screen from "../../pages/ErrorPages/401";
// import {
//     useLazyGetConfigurationsQuery,
// // } from '../../features/resources/resources-api-slice';
// import { useEffect } from "react";
// import { useToast } from "@chakra-ui/react";
// import { useDispatch } from "react-redux";
// import { setConfigurations } from '../../features/global/global-slice';


type ChildProps = {
    permissions: {},
    children: ReactNode;
}

const ProtectedRoute: React.FC<ChildProps> = ({ children, permissions = [] }) => {
    let user = {}
    // const user = useSelector((state) => state.authentication.user);
    // const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    // const hasPermission = permissions.every((permission) => userPermissions.has(permission));
    const hasPermission = true

    // const [getConfigurations, { error }] = useLazyGetConfigurationsQuery()
    // const toast = useToast();
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     (async () => {
    //         const response = await getConfigurations().unwrap()
    //         if (response?.configurations) {
    //             dispatch(setConfigurations(response.configurations))
    //         }
    //     })()
    // }, [])

    if (!hasPermission)
        return <Error401Screen />
    return user ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
