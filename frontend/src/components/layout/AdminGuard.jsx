import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    if (!isAdmin) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
}
