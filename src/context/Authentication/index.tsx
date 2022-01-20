import React, {
  createContext,
  memo,
  useReducer
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Props, AuthCredentials, AuthContextType, AuthenticationSettings
} from 'types';
import {
  useLoginMutation, useLazyValidateTokenQuery
} from 'services/familyTreeApi';

export const AuthenticationContext = createContext<AuthContextType>({} as AuthContextType);
AuthenticationContext.displayName = 'AuthenticationContext';

export const actions = {
  USER_LOGGEDIN: 'USER_LOGGEDIN'
};

const AuthenticationProvider: React.FC<Props> = ({ children }) => {
  const [fetchToken] = useLoginMutation();
  const [checkTokenValidity] = useLazyValidateTokenQuery();

  const navigate = useNavigate();

  // TODO
  const signout = (callback: VoidFunction) => {
    // setUser(null);
    callback();
  };

  const [settings, dispatch] = useReducer((state: AuthenticationSettings, action: any) => {
    switch (action.type) {
      case 'RESET_STATE':
        return { ...state };
      case actions.USER_LOGGEDIN:
        return {
          ...state,
          user: action.user
        };
      default:
        throw new Error();
    }
  }, {
    signin: async (credentials: AuthCredentials, callback: VoidFunction) => {
      fetchToken({ userLoginData: credentials })
        .then((payload: any) => {
          dispatch({ type: actions.USER_LOGGEDIN, user: { ...payload.data } });
          sessionStorage.setItem(
            'credentials',
            JSON.stringify({ ...payload.data })
          );
          if (callback) {
            callback();
          }
        })
        .catch((error) => {
          // handled by error middleware
        });
    },
    signout,
    validateToken: async (storageCredentials: string, nextLocation: string) => {
      if (settings.user) {
        return;
      }
      const credentials = JSON.parse(storageCredentials);
      const payload = await checkTokenValidity({ token: credentials.token });

      if (payload.data && payload.data.valid) {
        dispatch({ type: actions.USER_LOGGEDIN, user: { ...credentials } });
        navigate(nextLocation);
      } else {
        dispatch({ type: actions.USER_LOGGEDIN, user: null });
        sessionStorage.clear();
        navigate('/login');
      }
    },
    user: null
  });

  return (
    // <AuthenticationContext.Provider value={providerProps}>
    <AuthenticationContext.Provider value={{ settings, dispatch }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default memo(AuthenticationProvider);