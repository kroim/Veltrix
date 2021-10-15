import {
  SET_ENABLE_ADDING_PROJECT
} from "./actionTypes";

const initialState = {
  isEnabledAdding: false
};

const projects = (state = initialState, action) => {
  switch (action.type) {
    case SET_ENABLE_ADDING_PROJECT:
      state = {
        ...state,
        isEnabledAdding: action.payload.enable,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default projects;
