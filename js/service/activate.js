import { createStore } from 'redux';
import localforage from 'localforage';
import reducers from '../reducers.js';

const activate = () => {
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
