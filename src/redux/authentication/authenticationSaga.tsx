import { put, takeLatest, fork, call } from 'redux-saga/effects';

import { createApiCall, loginRoute, MethodType } from 'services/Api';
import { setCookie } from 'utils/cookies';
import { LoginData, ActionType } from 'model/model';

// login
function* loginSaga({ payload }: { payload: LoginData }): Generator<any> {
  try {

    const response: any = yield call(
      createApiCall, { method: MethodType.POST, url: loginRoute, data: payload }
    );
    if (response.status === 'ok') {
      setCookie('token', response.data.authToken.token);
      yield put({ type: ActionType.LOGIN_USER_SUCCESS, payload: response.data.authToken.token });
    } else {
      yield put({ type: ActionType.LOGIN_USER_ERROR, payload: 'error' })
    }
  } catch (error) {
    yield put({ type: ActionType.LOGIN_USER_ERROR, payload: 'error' })
  }
}
function* onLoginSubmitWatcher() {
  yield takeLatest(ActionType.LOGIN_USER as any, loginSaga);;
}

export default [
  fork(onLoginSubmitWatcher),
];