
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';
import SweetAlert from "react-bootstrap-sweetalert";

class ProfileMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: false,
            openLogoutDlg: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            menu: !prevState.menu
        }));
    }

    onLogout = () => {
        const { history } = this.props;
        this.setState({openLogoutDlg: false});
        localStorage.removeItem('token');
        localStorage.removeItem('authUser');
        history.push('/login');
    }

    render() {
        const { openLogoutDlg } = this.state;
        return (
            <React.Fragment>
                <Dropdown isOpen={this.state.menu} toggle={this.toggle} className="d-inline-block" >
                    <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                    <i className="mdi mdi-account-circle font-size-36 align-middle mr-1"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem tag="a" href="#"><i className="mdi mdi-account-circle font-size-17 align-middle mr-1"></i>Profile</DropdownItem>
                        <div className="dropdown-divider"></div>
                        <div
                            onClick={(e) => this.setState({openLogoutDlg: true})}
                            className="dropdown-item">
                            <i className="mdi mdi-logout font-size-17 align-middle mr-1"></i>
                            <span>Logout</span>
                        </div>
                    </DropdownMenu>
                    { openLogoutDlg ? 
                        <SweetAlert
                      title="Are you sure you want to log out?"
                      warning
                      showCancel
                      confirmBtnText="Yes"
                      confirmBtnBsStyle="danger"
                      cancelBtnBsStyle="success"
                      onConfirm={this.onLogout}
                      onCancel={() => this.setState({openLogoutDlg: false})}
                    >
                    </SweetAlert>
                    : 
                    null}
                </Dropdown>
            </React.Fragment>
        );
    }
}

export default withRouter(ProfileMenu);


