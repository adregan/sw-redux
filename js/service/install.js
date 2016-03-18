/**
 * @description
 * Constructs the install function for the SW
 * 
 * @param {object} opts
 * @param {string} opts.name      REQUIRED: The name of the app
 * @param {number} opts.version   The version number of the cache
 * @param {array}  opts.items     The urls to cache
 */

const install = (opts = {}) => {
  let { name, version, items } = opts;
  if (!name) {
    throw TypeError('Missing required parameter: name');
  }
  items = (!items) ? ['/'] : items;
  version = (version !== 0 && !version) ? 0 : version;

  const cacheName = `${name}-v${version}`;

  console.log(cacheName);

  return (event) => {
    console.log(`Installing SW: ${cacheName}`);
    event.waitUntil(
      caches.open(cacheName).then(cache => cache.addAll(items))
    );
  };
};

export default install;

