import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card } from "reactstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

// import images
import bg from "../../assets/images/bg.jpg";
import logoDark from "../../assets/images/logo-dark.png";
import { loginUser as loginUserAction } from "../../store/actions";
import PropTypes from 'prop-types';
import {toast} from "react-toastify";


class Login extends Component {
  static propTypes = {
    history: PropTypes.object,
    loginUser: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {error} = this.props;
    if(prevProps.error !== error && error){
      toast.error("login failed!", {hideProgressBar: true});
    }
  }

  onLogin = (e) => {
    const { loginUser, history } = this.props;
    let username = document.getElementById('username').value.trim();
    let userpassword = document.getElementById('userpassword').value;
    if(username.length && userpassword.length){
      loginUser({name: username, password: userpassword}, history);
    }
    e.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        {" "}
        <div
          className="accountbg"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${bg})`
          }}
        ></div>
        <div className="wrapper-page account-page-full">
          <Card className="shadow-none">
            <div className="card-block">
              <div className="account-box">
                <div className="card-box shadow-none p-4">
                  <div className="p-2">
                    <div className="text-center mt-4">
                      <Link to="/">
                        <img src={logoDark} height="22" alt="logo" />
                      </Link>
                    </div>

                    <h4 className="font-size-18 mt-5 text-center">
                      Welcome Back !
                    </h4>
                    <p className="text-muted text-center">
                      Sign in to continue to P2IC.
                    </p>

                    <form className="mt-4" action="#">
                      <div className="form-group">
                        <label htmlFor="username">Email/Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          placeholder="Enter email or name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="userpassword">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="userpassword"
                          placeholder="Enter password"
                        />
                      </div>

                      <Row className="form-group">
                        <Col sm={6}>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customControlInline"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customControlInline"
                            >
                              Remember me
                            </label>
                          </div>
                        </Col>

                        <Col sm="6" className="text-right">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            onClick={this.onLogin}
                          >
                            Log In
                          </button>
                        </Col>
                      </Row>

                      <Row className="form-group mt-2 mb-0">
                        <div className="col-12 mt-3">
                          <Link to="forget-password">
                            <i className="mdi mdi-lock"></i> Forgot your
                            password?
                          </Link>
                        </div>
                      </Row>
                    </form>

                    <div className="mt-5 pt-4 text-center">
                      <p>
                        Don't have an account ?{" "}
                        <Link
                          to="register"
                          className="font-weight-medium text-primary"
                        >
                          {" "}
                          Signup now{" "}
                        </Link>{" "}
                      </p>
                      <p>
                        © {new Date().getFullYear()} P2IC. Crafted with{" "}
                        <i className="mdi mdi-heart text-danger"></i> by
                        Blue Ocean HPA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {error: state.Login.error};
}

const mapDispatchToProps = dispatch => ({
  loginUser: (param1, param2) => dispatch(loginUserAction(param1, param2)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
