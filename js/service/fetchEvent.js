
/**
 * fetchEvent : Object -> Function
 * @description
 * Constructs the fetchEvent function for the SW
 *
 */
const fetchEvent = () => {
  return (event) => {
    event.respondWith(
      caches.match(event.request).then(request => request || fetch(event.request))
    );
  };
};

export default fetchEvent;

