export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';

export const add = () => {
  return {type: INCREMENT};
};

export const subtract = () => {
  return {type: DECREMENT};
};
