import localforage from 'localforage';

/**
 * install : Object -> Function 
 * @description
 * Constructs the install function for the SW
 * 
 * @param {object} opts 
 * @param {string} opts.name      REQUIRED: The name of the app
 * @param {number} opts.version   The version number of the cache
 * @param {array}  opts.items     The urls to cache
 */
const install = ({name, version = 1, items = ['/']}) => {
  if (!name) throw TypeError('Missing required parameter: name');
  const cacheName = `${name}-v${version}`;

  console.log('Installing service worker and database. ' +
    `Name: ${name}, Version: ${version}`);

  localforage.config({name, version, driver: localforage.INDEXEDDB});

  return (event) => {
    event.waitUntil(
      new Promise((resolve, reject) => {
        localforage.getItem('state')
          .then(s => {return (!s) ? localforage.setItem('state', 0) : true;})
          .then(() => caches.open(cacheName))
          .then(cache => cache.addAll(items))
          .then(() => resolve(true))
          .catch(err => {console.error(err); reject(err);});
      })
    );
  };
};

export default install;

