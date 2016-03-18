/* 
 * activate : Object -> Function
 *
 * @description
 * Will reactivate the store with stored data and send it to the clients.
 *
 * @param {object} store    REQUIRED: A redux store
 *
 * Note: `self` refers to the service worker's global scope (like `window`).
 *
 */
const activate = (store) => {
  if (!store) throw TypeError('Missing required parameter: store');
  store.dispatch({type: 'ACTIVATE'});
  return (event) => {
    event.waitUntil(
      self.clients.claim()
        .then(() => self.clients.matchAll())
        .then(clients => {
          return Promise.all(clients.map(c => c.postMessage(store.getState())));
        })
        .catch(err => console.error(err))
    );  
  };
};

export default activate;
