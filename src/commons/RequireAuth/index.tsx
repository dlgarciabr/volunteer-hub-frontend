import React, { memo, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { AuthenticationContext } from '../../context/Authentication';

interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const storageCredentials = sessionStorage.getItem('credentials');
  const { user, validateToken } = React.useContext(AuthenticationContext);
  const location = useLocation();

  useEffect(() => {
    if (!user && storageCredentials) {
      (async () => {
        validateToken(storageCredentials, location.pathname);
      })();
    }
  }, []);

  if (!user && !storageCredentials) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default memo(RequireAuth);