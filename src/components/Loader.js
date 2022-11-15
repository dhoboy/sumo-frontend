import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import rikishiSvg from "../assets/rikishi.svg";
import styles from "./styles/Loader.module.css";

const prop_info = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  size: PropTypes.string, // size is "small", "medium", or "large"
  className: PropTypes.string,
};

const Loader = ({
  loading,
  children,
  error = false,
  errorMsg = "An error occured. Please try again later!",
  size = "medium",
  className = null,
}) => {
  const [display, setDisplay] = useState(""); // loader, component, or error
  const startTime = useRef(null);

  useEffect(() => {
    startTime.current = new Date();

    if (loading) setDisplay("loading");
    if (error) setDisplay("error");

    // component is ready, make UI transition smooth
    if (!loading && !error) {
      const endTime = new Date();
      if (endTime - startTime.current >= 4000) {
        setDisplay("component");
      } else {
        setTimeout(() => {
          setDisplay("component");
        }, 2000);
      }
    }
    return () => (startTime.current = null);
  }, [error, loading, setDisplay]);

  if (display === "loading") {
    return (
      <div className={`${styles.wrapper} ${className ? className : ""}`}>
        <img
          src={rikishiSvg}
          alt="loading"
          className={`${styles.img} ${styles[size]}`}
        />
      </div>
    );
  } else if (display === "error") {
    return <div>{errorMsg || "An error occured"}</div>;
  }

  return <>{children}</>;
};

Loader.propTypes = prop_info;

export default Loader;
