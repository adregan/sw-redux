import { createStore } from 'redux';
import count from './reducers.js';

const VERSION = 11;
const CACHE_NAME = `sw-redux-v${VERSION}`;

const toCache = [
  '/',
  '/static/index.js'
];

let store;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(toCache))
  );
});

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
  console.log(`Activated: ${CACHE_NAME}`);
  store = createStore(count);
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

