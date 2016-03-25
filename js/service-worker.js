import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers.js';
import install from './service/install';
import activate from './service/activate';
import fetchEvent from './service/fetchEvent';
import message from './service/message';
import { reset, stash } from './service/middleware';
import { cache as cacheConfig } from '../config';

const { name, version, items } = cacheConfig;
const store = applyMiddleware(reset, stash)(createStore)(reducers);

self.addEventListener('install', install({ name, version, items }));
self.addEventListener('activate', activate({ store, name, version }));
self.addEventListener('message', message({store}));
self.addEventListener('fetch', fetchEvent());

self.addEventListener('error', (event) => {
  console.error('ERROR in service worker: ', event.message);
});


/* NOT SURE WHEN THESE GET FIRED AND WHAT TO USE THEM FOR
 * TODO: FIGURE OUT WHAT THEY DO AND HOW TO USE THEM
 */

self.addEventListener('updatefound', (event) => {
  console.log('UPDATE FOUND: ', event);
});

self.addEventListener('statechange', (event) => {
  console.log('STATE CHANGED: ', event);
});

self.addEventListener('controllerchange', (event) => {
  console.log('CONTROLLER CHANGED: ', event);
});

