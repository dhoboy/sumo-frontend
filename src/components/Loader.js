import React from "react";
import rikishiSvg_dark from "../assets/rikishi-dark.svg";
import styles from "./styles/Loader.module.css";

const Loader = ({ loading, error, errorMsg, children }) => {
  if (loading) {
    return <img src={rikishiSvg_dark} alt="loading" className={styles.img} />;
  } else if (error) {
    return <div>{errorMsg || "An error occured"}</div>;
  }

  return <>{children}</>;
};

export default Loader;
