import React, { Component } from 'react';

class NonAuthLayout extends Component {
    render() {
        return <React.Fragment>
            {this.props.children}
        </React.Fragment>;
    }
}

export default NonAuthLayout;