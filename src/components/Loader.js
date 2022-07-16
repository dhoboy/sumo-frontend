import React, { useState, useRef, useLayoutEffect } from "react";
import rikishiSvg_dark from "../assets/rikishi-dark.svg";
import styles from "./styles/Loader.module.css";

const Loader = ({ loading, error, errorMsg, children }) => {
  const [display, setDisplay] = useState(""); // loader, component, error
  const startTime = useRef(new Date());

  useLayoutEffect(() => {
    if (loading) setDisplay("loading");
    if (error) setDisplay("error");

    // component is ready, make UI transition smooth
    if (!loading && !error) {
      const endTime = new Date();
      if (endTime - startTime.current >= 4000) {
        setDisplay("component");
      } else {
        setTimeout(() => setDisplay("component"), 2000);
      }
    }
  }, [error, loading, setDisplay]);

  if (display === "loading") {
    return <img src={rikishiSvg_dark} alt="loading" className={styles.img} />;
  } else if (display === "error") {
    return <div>{errorMsg || "An error occured"}</div>;
  }

  return <>{children}</>;
};

export default Loader;
