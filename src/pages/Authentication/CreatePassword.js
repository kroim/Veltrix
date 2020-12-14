import React, { Component } from "react";
import { Row, Card } from "reactstrap";
import { Link } from "react-router-dom";
import { getBackendAPI } from "../../helpers/backend";

// import images
import bg from "../../assets/images/bg.jpg";
import logoDark from "../../assets/images/logo-dark.png";

class CreatePassword extends Component {
  constructor(props) {
    super(props);
    const { history, location } = props;
    
    let id = location.search.replace("?id=", "");
    if(!id || !id.length){
      history.push('/login');
    }

    this.state = {
      member_id: id,
      member: null
    };
    console.log('member_id', id);
    this.init(id);
  }

  init = async(id) => {
    const { history } = this.props;
    let member = await getBackendAPI().getMember(id);
    if(!member || member.is_registered){
      history.push('/login');
      return;
    }
    this.setState({member: member});
  }

  onRegister = async(e) => {
    const { history } = this.props;
    const { member_id, member } = this.state;
    e.preventDefault();
    let username = document.getElementById('username').value;
    let userpassword = document.getElementById('userpassword').value;
    if(userpassword.trim().length){
      try{
        await getBackendAPI().registerUserByMail(member.email, username, userpassword, member_id);
        history.push('/login');
      } catch(e){
        console.log('error', e);
      }
    }
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
                      <Link to="index.html">
                        <img src={logoDark} height="22" alt="logo" />
                      </Link>
                    </div>

                    <h4 className="font-size-18 mt-5 text-center">
                      Free Register
                    </h4>
                    <p className="text-muted text-center">
                      Get your free Veltrix account now.
                    </p>

                    <form className="mt-4" action="#">
                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          placeholder="Enter username"
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
                        <div className="col-12 text-right">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            onClick={this.onRegister}
                          >
                            Register
                          </button>
                        </div>
                      </Row>

                      <Row className="form-group mt-2 mb-0">
                        <div className="col-12 mt-3">
                          <p className="mb-0">
                            By registering you agree to the Veltrix{" "}
                            <Link to="#" className="text-primary">
                              Terms of Use
                            </Link>
                          </p>
                        </div>
                      </Row>
                    </form>

                    <div className="mt-5 pt-4 text-center">
                      <p>
                        Already have an account ?{" "}
                        <Link
                          to="login"
                          className="font-weight-medium text-primary"
                        >
                          {" "}
                          Login{" "}
                        </Link>{" "}
                      </p>
                      <p>
                        © {new Date().getFullYear()} Veltrix. Crafted with{" "}
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

export default CreatePassword;
