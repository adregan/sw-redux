import { messageClients } from './utils';
/**
 * push: Object -> Function
 * @description
 * Constructs the message event handler for the SW
 *
 * @param {object} opts
 * @param {object} opts.store        REQUIRED: A redux store
 */

const push = ({store}) => {
  return (event) => {
    const {id} = store.getState();
    fetch(`http://localhost:8080/counters/${id}`)
      .then(res => res.json())
      .then(({count}) => store.dispatch({type: 'RESET', state: count, id}))
      .then(() => messageClients(store.getState()))
      .catch(err => console.error(err));
  };
};

export default push;
