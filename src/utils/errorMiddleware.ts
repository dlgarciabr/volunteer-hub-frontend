import {
  MiddlewareAPI,
  Middleware,
  isRejected
} from '@reduxjs/toolkit';
import { AnyAction, Dispatch } from 'redux';

import { dispatchErrorNotification } from '../hooks/notificationHandler';

const handler = (action: AnyAction, dispatch: Dispatch) => {
  if (isRejected(action)) {
    if ((action.payload as any).status === 404) {
      dispatchErrorNotification(dispatch, 'try again later');
      return;
    }
    dispatchErrorNotification(dispatch, 'error not handled');
  }
};

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (dispatch) => (
  (action: AnyAction) => {
    handler(action, dispatch);
    return dispatch(action);
  }
);