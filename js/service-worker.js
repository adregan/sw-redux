import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers.js';
import install from './service/install';
import activate from './service/activate';
import { cache } from '../config';

const store = applyMiddleware()(createStore)(reducers);

self.addEventListener('install', install(cache));
self.addEventListener('activate', activate()); 

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(request => {
        return (request) ? request : fetch(event.request);
      })
  );
});


self.addEventListener('message', (event) => {
  self.store.dispatch(event.data);
  event.ports[0].postMessage(self.store.getState());
});

