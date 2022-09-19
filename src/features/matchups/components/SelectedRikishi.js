import React from "react";
import styles from "./SelectedRikishi.module.css";

const SelectedRikishi = ({ allRikishi, rikishiName }) => {
  const imgUrl = allRikishi?.[rikishiName.toUpperCase()]?.image || null;

  return (
    <div className={styles.selectedRikishi}>
      <img src={imgUrl} alt="rikishi" loading="lazy" />
      <h3>{rikishiName}</h3>
    </div>
  );
};

export default SelectedRikishi;
