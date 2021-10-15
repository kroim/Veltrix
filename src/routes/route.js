import React from "react";
import { Route, Redirect } from "react-router-dom";

//AUTH related methods
import {connect} from "react-redux";

const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isAdminProtected,
  user,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {

      if (isAuthProtected && !user) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      } else if(!isAuthProtected && user){
        return (
          <Redirect
            to={{ pathname: "/dashboard", state: { from: props.location } }}
          />
        );
      } else if(isAdminProtected && user.role !== 'admin'){
          return (
              <Redirect
                  to={{ pathname: "/dashboard", state: { from: props.location } }}
              />
          );
      }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

const mapStateToProps = state => {
    return {
        user: state.Login.user
    };
};

export default connect(mapStateToProps, null)(AppRoute);
