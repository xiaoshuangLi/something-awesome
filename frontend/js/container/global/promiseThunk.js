const promiseThunk = store => next => (action) => {
  next(action);
  return Promise.resolve(store.getState());
};

export default promiseThunk;
