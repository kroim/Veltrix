import {APP_INIT, APP_INIT_SUCCESS} from './actionTypes';

const initialState = {
    init: false
}

const app = (state = initialState, action) => {
    switch (action.type) {
        case APP_INIT:
            state = {
                ...state
            }
            break;
        case APP_INIT_SUCCESS:
            state = {
                ...state,
                init: true
            }
    }
    return state;
}

export default app;
