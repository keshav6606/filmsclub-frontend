import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from "@nextui-org/spinner";

const PrivateRoute = ({ element, ...rest }) => {
   const { isAuthenticated, loading } = useAuth();
   const location = useLocation();

   // 1. Loading State Handling
   if (loading) {
     // Use 'fixed' and 'inset-0' to ensure the spinner is centered in the viewport
     return (
       <div className="fixed inset-0 flex items-center justify-center bg-bgColor z-50">
         <Spinner size="lg" labelColor="warning" label="Loading..." color="warning" />
       </div>
     );
   }

   // 2. Authentication Check
   return isAuthenticated ? (
     element // Render the protected component if authenticated
   ) : (
     // 3. Redirection to Login
     <Navigate to="/login" state={{ from: location }} replace />
   );
};

export default PrivateRoute;
