
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {logoutUser as logoutAction} from '../store/auth/login/actions';

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
        const { history, logout } = this.props;
        this.setState({openLogoutDlg: false});
        logout(history);
    }

    render() {
        const { user } = this.props;
        const { openLogoutDlg } = this.state;
        return (
            <React.Fragment>
                <Dropdown isOpen={this.state.menu} toggle={this.toggle} className="d-inline-block" >
                    <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                    <i className="mdi mdi-account-circle font-size-36 align-middle mr-1"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                        {
                            user.role === 'admin'?
                                <>
                                    <DropdownItem
                                        tag="a" href="#"
                                        onClick={(e) => this.props.history.push('/change_sys_password')}
                                    ><i className="mdi mdi-alert font-size-17 align-middle mr-1"></i>Change System Password</DropdownItem>
                                    <div className="dropdown-divider"></div>
                                </>
                            :null
                        }
                        <DropdownItem
                            tag="a" href="#"
                            onClick={(e) => this.props.history.push('/change_password')}
                        ><i className="mdi mdi-lock font-size-17 align-middle mr-1"></i>Change Your Password</DropdownItem>
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

const mapStateToProps = state => ({
    user: state.Login.user
})

const mapDispatchToProps = dispatch => ({
    logout: (params) => dispatch(logoutAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileMenu));


