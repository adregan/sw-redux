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
  return (event) => {
    event.waitUntil(
      localforage.getItem('state')
        .then(state => createStore(reducers, state))
        .then(store => {
          self.store = store;
          self.clients.claim()
            .then(() => self.clients.matchAll())
            .then(clients => {
              return Promise.all(
                clients.map(client => client.postMessage(store.getState()))
              );
            });
        })
        .catch(err => console.error(err))
    );
  };
};

export default activate;
