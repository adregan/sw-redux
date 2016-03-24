import { getCacheName, clearCache, messageClients } from './utils';
/*
 * activate : Object -> Function
 *
 * @description
 * Will reactivate the store with stored data and send it to the clients.
 *
 * @param {object} opts
 * @param {object} opts.store        REQUIRED: A redux store
 * @param {string} opts.name         The cache name
 * @param {string} opts.version      The cache version
 *
 * Note: `self` refers to the service worker's global scope (like `window`).
 *
 */
const activate = ({store, name, version}) => {
  if (!store) throw TypeError('Missing required parameter: store');

  const cacheName = getCacheName(name, version);

  store.dispatch({type: 'ACTIVATE'});

  return (event) => {
    event.waitUntil(
      self.caches.keys()
        .then(keys => clearCache(keys, cacheName))
        .then(() => self.clients.claim())
        .then(() => messageClients(store.getState()))
        .catch(err => console.error(err))
    );
  };
};

export default activate;
