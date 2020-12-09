import React from "react";
import { Route, Redirect } from "react-router-dom";

//AUTH related methods
import { initBackendAPI } from "../helpers/authUtils";

const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      const backendAPI = initBackendAPI();

      if (isAuthProtected && !backendAPI.getAuthenticatedUser()) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
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

export default AppRoute;
