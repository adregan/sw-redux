import { combineReducers } from 'redux';
import { INCREMENT, DECREMENT, SET_ID } from './actions.js';

const count = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    case 'RESET':
      return action.state;
    default:
      return state;
  }
};

const id = (state = '', action) => {
  switch (action.type) {
    case SET_ID:
      return action.id;
    case 'RESET':
      return action.id;
    default:
      return state;
  }
};

export default combineReducers({count, id});
