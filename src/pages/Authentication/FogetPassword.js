import React, { Component } from "react";
import { Row, Card } from "reactstrap";
import { Link } from "react-router-dom";
// import images
import bg from "../../assets/images/bg.jpg";
import logoDark from "../../assets/images/logo-dark.png";

class ForgotPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
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
                      Reset Password
                    </h4>

                    <form className="mt-4" action="#">
                      <div className="alert alert-success mt-4" role="alert">
                        Enter your Email and instructions will be sent to you!
                      </div>

                      <div className="form-group">
                        <label htmlFor="useremail">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="useremail"
                          placeholder="Enter email"
                        />
                      </div>

                      <Row className="form-group">
                        <div className="col-12 text-right">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            type="submit"
                          >
                            Reset
                          </button>
                        </div>
                      </Row>
                    </form>

                    <div className="mt-5 pt-4 text-center">
                      <p>
                        Remember It ?{" "}
                        <Link
                          to="pages-login-2"
                          className="font-weight-medium text-primary"
                        >
                          {" "}
                          Sign In here{" "}
                        </Link>{" "}
                      </p>
                      <p>
                        © {new Date().getFullYear()}
                        Veltrix. Crafted with{" "}
                        <i className="mdi mdi-heart text-danger"></i> by
                        Themesbrand
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

export default ForgotPasswordPage;
