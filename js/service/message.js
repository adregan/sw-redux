import { messageClients } from './utils';
/**
 * message : Object -> Function
 * @description
 * Constructs the message event handler for the SW
 *
 * @param {object} opts
 * @param {object} opts.store        REQUIRED: A redux store
 */

const message = ({store}) => {
  return (event) => {
    store.dispatch(event.data);
    messageClients(store.getState()).catch(err => console.error(err));
  };
};

export default message;
