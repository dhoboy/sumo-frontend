import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import AppContent from "./AppContent";
import "@fortawesome/fontawesome-free/js/all.js";
import "./scss/app.scss";

const App = ({ store = {} }) => {
  return (
    <Provider store={store}>
      <HashRouter hashType="noslash" basename={"sumo"}>
        <AppContent />
      </HashRouter>
    </Provider>
  );
}

export default App;
