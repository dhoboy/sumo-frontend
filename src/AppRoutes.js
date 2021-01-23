import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import RikishiList from "./components/RikishiList";
import MatchResults from "./components/MatchResults";

const AppRoutes = () => {
  return (
    <Switch>
      <Route 
        exact
        path="/"
        render={routeProps => <Redirect {...routeProps} to="/rikishi" />}
      />
      <Route
        path="/rikishi"
        render={routeProps => <RikishiList { ...routeProps} />}
      />
      <Route
        path="/match-results"
        render={routeProps => <MatchResults { ...routeProps} />}
      />
    </Switch>
  );
};

export default AppRoutes;
