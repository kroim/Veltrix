import React, { Component } from "react";
import {Row, Card, Col} from "reactstrap";
import {connect} from "react-redux";
import { getBackendAPI } from "../../helpers/backend";
import {toast} from "react-toastify";

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };

  }


  onChange = async(e) => {
    const { user } = this.props;
    e.preventDefault();
    let userpassword = document.getElementById('userpassword').value;
    let newpassword = document.getElementById('newpassword').value;
    let confirmpassword = document.getElementById('confirmpassword').value;
    if(userpassword.length && newpassword.length && newpassword === confirmpassword){
      try{
        const res = await getBackendAPI().changePassword( user._id, userpassword, newpassword);
        if(res.success){
          toast.info("Changing your password success", {hideProgressBar: true});
        } else {
          toast.error("Changing your password failed!", {hideProgressBar: true});
        }
      } catch(e){
        console.log('error', e);
        toast.error("Changing your password failed!", {hideProgressBar: true});
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid mt-4">
          <Row className="justify-content-center">
            <Col sm={6}>
              <Card className="shadow-none">
            <div className="card-block">
              <div className="account-box">
                <div className="card-box shadow-none p-4">
                  <div className="p-2">
                    <form className="mt-4" action="#">
                      <div className="form-group">
                        <label htmlFor="userpassword">Old Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="userpassword"
                          placeholder="Enter current password"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="newpassword">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="newpassword"
                            placeholder="Enter new password"
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
                            onClick={this.onChange}
                          >
                            Change Password
                          </button>
                        </div>
                      </Row>

                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Login.user
  }
}

export default connect(mapStateToProps, null)(ChangePassword);
