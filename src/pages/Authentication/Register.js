import React, { Component } from "react";
import { Row, Card } from "reactstrap";
import { Link } from "react-router-dom";
import { getBackendAPI } from "../../helpers/backend";

// import images
import bg from "../../assets/images/bg.jpg";
import logoDark from "../../assets/images/logo-dark.png";
import {toast} from "react-toastify";

class Register extends Component {
  constructor(props) {
    super(props);
    const { location } = props;

    let id = location.search.replace("?id=", "");
    this.state = {
      member_id: (!id || !id.length)?null:id,
      member: null,
      email: '',
      username: '',
    };
    this.mounted = false;

    this.init(this.state.member_id);
  }

  componentDidMount() {
    this.mounted = true;
  }

  init = async(id) => {
    if(!id){
      return;
    }
    const { history } = this.props;
    let member = await getBackendAPI().getMember(id);
    if(member && member.is_registered){
      history.push('/login');
      toast.info("This user is already registered. Please login", {hideProgressBar: true});
      return;
    }
    if(this.mounted){
      this.setState({member: member, email: member?member.email:'', username:member?member.handle.slice(1):''});
    } else {
      this.state.member = member;
    }
  }

  onRegister = async(e) => {
    const { history } = this.props;
    const { member, member_id } = this.state;
    e.preventDefault();
    let useremail = document.getElementById('useremail').value.trim();
    let username = document.getElementById('username').value.trim();
    let userpassword = document.getElementById('userpassword').value;
    let confirmpassword = document.getElementById('confirmpassword').value;
    console.log('user', useremail, username, userpassword, confirmpassword);
    let role = 'user';
    if(useremail.length && this.validateEmail(useremail) && username.length && userpassword.length && userpassword === confirmpassword){
      if(member){
        if(member.email !== useremail || member.handle !== ('@' + username)){
          toast.error("This email and name is not registered", {hideProgressBar: true});
          return;
        }
        try{
          await getBackendAPI().registerUserByMail(member.email, username, userpassword, member_id);
          toast.info("You set your password successfully", {hideProgressBar: true});
          history.push('/login');
        } catch(e){
          toast.error("Setting your password was failed", {hideProgressBar: true});
          console.log('error', e);
        }
      } else {
        try{
          await getBackendAPI().registerUser(useremail, username, userpassword, role);
          toast.info("You were registered successfully", {hideProgressBar: true});
          history.push('/login');
        } catch(e){
          toast.error("Registering was failed", {hideProgressBar: true});
          console.log('error', e);
        }
      }
    } else {
      toast.error("Invalid Input.", {hideProgressBar: true});
    }
  }


  validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  render() {
    const {member, email, username} = this.state;
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
                        <label htmlFor="useremail">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="useremail"
                          value={email}
                          onChange={event => this.setState({email: event.target.value})}
                          placeholder="Enter email"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          value={username}
                          onChange={event => this.setState({username: event.target.value})}
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

                      <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmpassword"
                            placeholder="Enter confirm password"
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

export default Register;
