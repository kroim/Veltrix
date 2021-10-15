import { takeEvery, fork, put, all, call } from 'redux-saga/effects';
import {APP_INIT} from "./actionTypes";

// Import Configuration file
import { initBackendAPI } from "../../helpers/backend";
import {loginSuccess} from "../auth/login/actions";
import {initSuccess} from "./actions";

function* appInit() {
    try {
        let token = localStorage.getItem("token");
        const backendAPI = initBackendAPI();
        if(token) {
            const user = yield call(backendAPI.fetchUser, token);
            if(user){
                localStorage.setItem('token', user.token);
                yield call(backendAPI.setLoggeedInUser, user);
                yield put(loginSuccess(user));
            }
        }
    } catch (error) {
        console.log('err', error);
    }
    yield put(initSuccess());
}

export function* watchAppInit() {
    yield takeEvery(APP_INIT, appInit)
}

function* appSaga() {
    yield all([
        fork(watchAppInit),
    ]);
}

export default appSaga;
