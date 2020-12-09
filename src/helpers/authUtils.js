import { getCall, postCall } from "../apiCall";

class BackendAPI {
  constructor() {
      let token = sessionStorage.getItem("token");
      console.log('session token', token);
      if(!token) return;
      getCall(
        `{
          me(token: "${token}"){
            _id,
            email,
            name,
            token
          }
        }`, 
        (res) => {
          if (res.me) {
            sessionStorage.setItem("authUser", JSON.stringify(res.me));
          } else {
            sessionStorage.removeItem("authUser");
          }
        });
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
      postCall('',
      (user) => {
            resolve(user);
          },
          error => {
            reject(this._handleError(error));
          }
      );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (name, password) => {
    return new Promise((resolve, reject) => {
      getCall(`{
        login(name:"${name}", password:"${password}"){
          _id,
          email,
          name,
          token
         }
        }`,(user) => {
            resolve(user);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = email => {
    return new Promise((resolve, reject) => {
      postCall('',() => {
          console.log("yes authutils");
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      postCall('',() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  setLoggeedInUser = user => {
    sessionStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!sessionStorage.getItem("authUser")) return null;
    return JSON.parse(sessionStorage.getItem("authUser"));
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}

let _backendAPI = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initBackendAPI = () => {
  if (!_backendAPI) {
    _backendAPI = new BackendAPI();
  }
  return _backendAPI;
};

/**
 * Returns the firebase backend
 */
const getBackendAPI = () => {
  return _backendAPI;
};

export { initBackendAPI, getBackendAPI };
