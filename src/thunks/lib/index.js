const isFunction = (action) => typeof action === 'function';

export default extraArgument => ({ dispatch, getState }) => next => action =>  {
  return isFunction(action)
    ? action(dispatch, getState, extraArgument)
    : next(action);
}
