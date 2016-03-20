import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers.js';
import install from './service/install';
import activate from './service/activate';
import { reset, stash } from './service/middleware';
import { cache as cacheConfig } from '../config';

const { name, version, items } = cacheConfig;
const store = applyMiddleware(reset, stash)(createStore)(reducers);

self.addEventListener('install', install({ name, version, items });
self.addEventListener('activate', activate({ store, name, version }));


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(request => {
        return (request) ? request : fetch(event.request);
      })
  );
});


self.addEventListener('message', (event) => {
  store.dispatch(event.data);
  event.ports[0].postMessage(store.getState());
});

