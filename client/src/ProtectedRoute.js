import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../src/context/auth/authContext";

function ProtectedRoute({ component: Component, ...rest }) {
  const authContext = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (authContext.isAuthenticated || authContext.loading) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/accessdenied",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
}

export default ProtectedRoute;
