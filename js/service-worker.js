import { createStore } from 'redux';
import count from './reducers.js';
import install from './service/install';
import { cache } from '../config';

let store;

self.addEventListener('install', install(cache));

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request)
      .then(r => {
        // Cache hit - return response
        if (r) {return r;}
        return fetch(e.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  store = createStore(count);
  console.log(store.getState());
  event.waitUntil(
    self.clients.claim()
      .then(() => self.clients.matchAll())
      .then(clients => {
        return Promise.all(
          clients.map(client => client.postMessage(store.getState()))
        );
      })
  ); 
});

self.addEventListener('message', (e) => {
  store.dispatch(e.data);
  e.ports[0].postMessage(store.getState());
});

