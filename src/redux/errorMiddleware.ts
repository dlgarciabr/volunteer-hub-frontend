import {
  MiddlewareAPI,
  Middleware,
  isRejected,
  isRejectedWithValue
} from '@reduxjs/toolkit';
import { AnyAction, Dispatch } from 'redux';

import { dispatchErrorNotification } from '../hooks/notificationHandler';

const handler = (action: AnyAction, dispatch: Dispatch) => {
  if (isRejectedWithValue(action) || isRejected(action)) {
    const httpStatusCode = action.payload ? (action.payload as any).status : undefined;
    switch (httpStatusCode) {
      case 400:
        dispatchErrorNotification(dispatch, 'Bad request');
        break;
      case 401:
        dispatchErrorNotification(dispatch, 'Wrong credentials');
        break;
      case 404:
        dispatchErrorNotification(dispatch, 'try again later');
        break;
      default:
        dispatchErrorNotification(dispatch, `error not handled http code: ${httpStatusCode}`);
    }
  }
};

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (dispatch) => (
  (action: AnyAction) => {
    handler(action, dispatch);
    return dispatch(action);
  }
);