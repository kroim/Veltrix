import { LOGIN_USER, LOGIN_SUCCESS, LOGOUT_USER, LOGOUT_USER_SUCCESS, API_ERROR } from './actionTypes';

const initialState = {
    error: null,
    loading: false,
    user: null
}

const login = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            state = {
                ...state,
                loading: true
            }
            break;
        case LOGIN_SUCCESS:
            state = {
                ...state,
                user: action.payload.user,
                loading: false
            }
            break;
        case LOGOUT_USER:
            state = {
                ...state
            };
            break;
        case LOGOUT_USER_SUCCESS:
            state = {
                ...state,
                user: null,
            };
            break;
        case API_ERROR:
            state = { ...state, error: action.payload, loading: false };
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default login;
