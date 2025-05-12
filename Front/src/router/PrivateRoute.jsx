import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

export const PrivateRoute = ({ children, redirectTo='/' }) => {
    const { status } = useAuthStore()

    if (status === 'not-authenticated') {
        return <Navigate to={redirectTo} />;
    }

    return children ? children : <Outlet/>
}