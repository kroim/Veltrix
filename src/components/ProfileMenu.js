
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';

// users
import user4 from '../assets/images/users/user-4.jpg';

class ProfileMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            menu: !prevState.menu
        }));
    }


    render() {

        return (
            <React.Fragment>
                <Dropdown isOpen={this.state.menu} toggle={this.toggle} className="d-inline-block" >
                    <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                        <img className="rounded-circle header-profile-user" src={user4} alt="Header Avatar" />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem tag="a" href="#"><i className="mdi mdi-account-circle font-size-17 align-middle mr-1"></i>Profile</DropdownItem>
                        <DropdownItem tag="a" href="#"><i className="mdi mdi-wallet font-size-17 align-middle mr-1"></i>My Wallet</DropdownItem>
                        <DropdownItem tag="a" href="#"><span className="badge badge-success float-right">11</span><i className="mdi mdi-settings font-size-17 align-middle mr-1"></i>Settings</DropdownItem>
                        <DropdownItem tag="a" href="#"><i className="mdi mdi-lock-open-outline font-size-17 align-middle mr-1"></i>Lock screen</DropdownItem>
                        <div className="dropdown-divider"></div>
                        <Link
                            to='/logout'
                            className="dropdown-item">
                            <i className="mdi mdi-logout font-size-17 align-middle mr-1"></i>
                            <span>Logout</span>
                        </Link>
                    </DropdownMenu>
                </Dropdown>
            </React.Fragment>
        );
    }
}

export default withRouter(ProfileMenu);


