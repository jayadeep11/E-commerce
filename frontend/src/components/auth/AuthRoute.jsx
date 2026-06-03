import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthRoute = ({ adminOnly = false, publicOnly = false }) => {
  const { userInfo } = useAuth();

  if (publicOnly) {
    return userInfo ? <Navigate to="/home" replace /> : <Outlet />;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !userInfo.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
