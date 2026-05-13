import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = () => {
  const { userInfo } = useAuth();

  
  return userInfo ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
