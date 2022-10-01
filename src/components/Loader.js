import React, { useState, useRef, useEffect } from "react";
import rikishiSvg_dark from "../assets/rikishi-dark.svg";
import styles from "./styles/Loader.module.css";

// size is "small", "medium", or "large"
const Loader = ({ loading, error, errorMsg, size, children, className }) => {
  const [display, setDisplay] = useState(""); // loader, component, error
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
      <div className={`${styles.wrapper} ${className}`}>
        <img
          src={rikishiSvg_dark}
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

export default Loader;
