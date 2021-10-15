import {APP_INIT, APP_INIT_SUCCESS} from './actionTypes';

export const init = () => {
    return {
        type: APP_INIT,
        payload: {}
    }
}

export const initSuccess = () => {
    return {
        type: APP_INIT_SUCCESS,
        payload: {}
    }
}

