import React, { Component } from "react";
import {Row, Card, Col} from "reactstrap";
import {connect} from "react-redux";
import { getBackendAPI } from "../../helpers/backend";
import {toast} from "react-toastify";

class ChangeSysPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };

  }


  onChange = async(e) => {
    const { user } = this.props;
    e.preventDefault();
    let syspassword = document.getElementById('syspassword').value;
    let newsyspassword = document.getElementById('newsyspassword').value;
    let confirmsyspassword = document.getElementById('confirmsyspassword').value;
    if(syspassword.length && newsyspassword.length && newsyspassword === confirmsyspassword){
      try{
        const res = await getBackendAPI().changeSysPassword(syspassword, newsyspassword);
        if(res.success){
          toast.info("Changing system password success", {hideProgressBar: true});
        } else {
          toast.error("Changing system password failed!", {hideProgressBar: true});
        }
      } catch(e){
        console.log('error', e);
        toast.error("Changing system password failed!", {hideProgressBar: true});
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
                        <label htmlFor="syspassword">Old System Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="syspassword"
                          placeholder="Enter current password"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="newsyspassword">New System Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="newsyspassword"
                            placeholder="Enter new password"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmsyspassword">Confirm System Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmsyspassword"
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

export default connect(mapStateToProps, null)(ChangeSysPassword);
