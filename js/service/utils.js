/*
 * getCacheName : String Int -> String
 *
 * @description
 * Constructs the cache name given a name and a version number
 *
 * @param {String} name    Required: The name of the cache
 * @param {Int} version    The version of the service worker
 */
export const getCacheName = (name, version) => {
  if (!name) throw TypeError('Missing required parameter: name');
  if (!version) console.warn('Please provide version number, defaulting to 1');
  return `${name}-v${version || 1}`;
};

/*
 * clearCache: Array String -> Promise
 *
 * @description
 * Given the list of cache name keys and the current cache name,
 * delete all of the old caches.
 *
 * @param {Array} keys        The cache name keys
 * @param {String} cacheName  The current service worker cache name
 *
 */
export const clearCache = (keys, cacheName) => {
  const oldKeys = keys.filter(key => key !== cacheName);
  console.log(`Found ${oldKeys.length} outdated cache(s): ${oldKeys}`);
  return Promise.all(oldKeys.map(key => self.caches.delete(key)));
};

