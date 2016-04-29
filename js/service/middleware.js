import localforage from 'localforage';

/*
 * @description
 * Will fire a reset action with the persisted state
 */
export const reset = store => next => action => {
  if (action.type !== 'ACTIVATE') return next(action);

  if (typeof action.count !== 'undefined') {
    localforage.setItem('state', action.count)
      .then(localforage.setItem('id', action.id));

    return store.dispatch({type: 'RESET', state: action.count, id: action.id});
  }

  let state;
  localforage.getItem('state')
    .then(savedState => {
      state = savedState;
      return localforage.getItem('id');
    })
    .then(id => store.dispatch({type: 'RESET', state, id}))
    .catch(err => console.error(err) && next(action));
};

/*
 * @desscription
 * Will stash the state of the store into IndexedDB on every update
 */
export const stash = store => next => action => {
  let result = next(action);

  if (action.type !== 'RESET') {
    const { count, id } = store.getState();
    localforage.setItem('state', count)
      .then(() => {
        const data = {count};
        fetch(`http://localhost:8080/counters/${id}`,
          { method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify(data)});
      })
      .catch(err => console.log(err));
  }

  return result;
};

