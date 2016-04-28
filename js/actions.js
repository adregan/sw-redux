export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
export const SET_ID = 'SET_ID';

export const add = () => {
  return {type: INCREMENT};
};

export const subtract = () => {
  return {type: DECREMENT};
};

export const setId = (id) => {
  return {type: SET_ID, id};
};
