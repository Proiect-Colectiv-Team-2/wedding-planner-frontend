
import { Navigate, useNavigate } from 'react-router-dom';  // Assuming this is your custom hook for accessing context
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // If no currentUser is set, return null until loading is complete
    if (currentUser === null) {
        return  <Navigate to="/" replace />
    }

    // If currentUser is not authenticated, redirect to login
    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    // If roles are defined and the user does not have permission, redirect to home
    if (roles && !roles.includes(currentUser.role)) {
        return <Navigate to="/home" replace />;
    }

    // Otherwise, render the protected content
    return children;
};

export default ProtectedRoute;
