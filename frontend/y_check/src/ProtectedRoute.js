import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { get_user_permissions } from './actions/PermissionAction';
import PatientPage from './pages/PatientPage/PatientPage';
const ProtectedRoute = ({ children, permissions }) => {
  const user_login = useSelector((state) => state.user_login);
  const { userInfo } = user_login;

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo && userInfo.id) {
      // Fetch user permissions based on user ID
      dispatch(get_user_permissions(userInfo.id));
    }
  }, [dispatch, userInfo]);

  const user_permissions = useSelector((state) => state.user_permission_list.user_perms);

  const hasPermissions = () => {
    if (!userInfo) {
      // If userInfo does not exist, redirect to login
      return false;
    }

    if (!permissions || permissions.length === 0 || user_permissions.length === 0) {
      // If permissions are not required, or user_permissions are not available, do not grant access
      return false;
    }

    // Check if the user has all the required permissions
    return permissions.every((permission) =>
      user_permissions.some((userPermission) => userPermission.codename === permission)
    );
  };

  return hasPermissions() ? children : userInfo ? <PatientPage /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
