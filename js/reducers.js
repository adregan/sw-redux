import { INCREMENT, DECREMENT } from './actions.js';

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

export default count; 
