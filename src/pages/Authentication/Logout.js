import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logoutUser } from '../../store/actions';

class Logout extends Component {
    /**
     * Redirect to login
     */
    componentDidMount = () => {
        // emit the event
        this.props.logoutUser(this.props.history);
    };

    render() {
        return <React.Fragment></React.Fragment>;
    }
}

export default withRouter(
    connect(
        null,
        { logoutUser }
    )(Logout)
);
