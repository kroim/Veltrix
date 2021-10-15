import {
  SET_ENABLE_ADDING_PROJECT
} from "./actionTypes";

export const setEnableAdding = (enable) => {
  return {
    type: SET_ENABLE_ADDING_PROJECT,
    payload: { enable }
  };
};
