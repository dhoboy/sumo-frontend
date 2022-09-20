import React from "react";
import PropTypes from "prop-types";
import styles from "./SelectedRikishi.module.css";

const prop_info = {
  allRikishi: PropTypes.object.isRequired,
  rikishiName: PropTypes.string.isRequired,
  changeSelection: PropTypes.func.isRequired,
};

const SelectedRikishi = ({ allRikishi, rikishiName, changeSelection }) => {
  const imgUrl = allRikishi?.[rikishiName.toUpperCase()]?.image || null;

  return (
    <div onClick={changeSelection} className={styles.selectedRikishi}>
      <img src={imgUrl} alt="rikishi" loading="lazy" />
      <h3>{rikishiName}</h3>
    </div>
  );
};

SelectedRikishi.propTypes = prop_info;

export default SelectedRikishi;
