import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from './components/Header';
import MenuBar from './components/MenuBar';
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from './AppRoutes';
import Footer from "./components/Footer";

const AppContent = () => {
  const dispatch = useDispatch();
  const colorTheme = useSelector(state => state.ui.colorTheme);

  return (
    <div id="sumo-site" className={colorTheme}>
      <div className="page-body">
        <Header />
        <div className="main-content">
          <MenuBar />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppContent;
