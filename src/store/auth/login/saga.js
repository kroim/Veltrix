import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from './actionTypes';
import { loginSuccess, logoutUserSuccess, apiError } from './actions';

//AUTH related methods
import { initBackendAPI } from '../../../helpers/backend';

const backendAPI = initBackendAPI();

function* loginUser({ payload: { user, history } }) {
    try {
        const response = yield call(backendAPI.loginUser, user.name, user.password);
        const { login } = response;
        if(login.token){
            localStorage.setItem('token', login.token);
            yield call(backendAPI.setLoggeedInUser, login);
            yield put(loginSuccess(login));
            history.push('/dashboard');
        } else {
            yield put(apiError("Invalid User"));
        }
    } catch (error) {
        yield put(apiError(error));
    }
}

function* logoutUser({ payload: { history } }) {
    try {
        const response = yield call(backendAPI.logout);
        yield put(logoutUserSuccess(response));
        history.push('/login');
    } catch (error) {
        yield put(apiError(error));
    }
}


export function* watchUserLogin() {
    yield takeEvery(LOGIN_USER, loginUser)
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser)
}

function* authSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
    ]);
}

export default authSaga;