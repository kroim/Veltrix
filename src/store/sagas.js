import { all } from 'redux-saga/effects';

//public
import AppSaga from './app/saga';
import AccountSaga from './auth/register/saga';
import AuthSaga from './auth/login/saga';
import ForgetSaga from './auth/forgetpwd/saga';
import LayoutSaga from './layout/saga';
import ProjectSaga from './projects/saga';


export default function* rootSaga() {
    yield all([
        AppSaga(),
        AccountSaga(),
        AuthSaga(),
        ForgetSaga(),
        LayoutSaga(),
        ProjectSaga(),
    ])
}
