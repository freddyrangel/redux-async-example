import { isFSA } from 'flux-standard-action';

const isFSAThunk = action => isFSA(action) && typeof action.payload === 'function';

export default extraArgument => ({ dispatch, getState }) => next => action => {
  if (isFSAThunk(action)) {
    dispatch({ ...action, payload: null });
    return action.payload(dispatch, getState, extraArgument);
  }

  return next(action);
}
