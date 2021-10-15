import React, { Component } from "react";
import {Row, Col, Button, Modal} from "reactstrap";
import { Link } from "react-router-dom";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {getBackendAPI} from "../../helpers/backend";
import {toast} from "react-toastify";
import {connect} from "react-redux";

class UserCapabilities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPassConfirmDlg: false
    };
  }

  componentDidMount() {}

  onReset = () => {
    this.setState({openPassConfirmDlg: true});
  }

  confirmPassword = async () => {
    let password = document.getElementById('password').value;
    try {
      const res = await getBackendAPI().checkSysPass({password: password});
      this.setState({openPassConfirmDlg: false});
      console.log('success', res);
      if(res.success){
        this.setState({openPassConfirmDlg: false});
        await getBackendAPI().reset();
        toast.info("App was successfully cleared.", {hideProgressBar: true});
      } else {
        toast.error("Password is not invalid!", {hideProgressBar: true});
      }
    } catch (e) {
      toast.error("Password is not invalid!", {hideProgressBar: true});
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">User Capabilities</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Admin</Link>
                  </li>
                  <li className="breadcrumb-item active">User Capabilities</li>
                </ol>
              </div>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <Button
                  color="primary"
                  className={"btn-primary btn waves-effect waves-light"}
                  onClick={this.onReset}
              >
                Clear App
              </Button>
            </Col>
          </Row>
          <Modal
              isOpen={this.state.openPassConfirmDlg}
              toggle={() => this.setState({openPassConfirmDlg: !this.state.openPassConfirmDlg })}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Confirm System Password
              </h5>
              <button
                  type="button"
                  onClick={() =>
                      this.setState({ openPassConfirmDlg: false })
                  }
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter system password"
              />
            </div>
            <div className="modal-footer">
              <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  onClick={this.confirmPassword}
              >
                Confirm
              </button>
            </div>
          </Modal>
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
export default connect(mapStateToProps, null)(UserCapabilities);
