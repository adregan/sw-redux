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

