import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/RikishiSelection.module.css";

const prop_info = {
  rikishiOrOpponent: PropTypes.string,
  allRikishi: PropTypes.object, // Object of all Rikishi info
  options: PropTypes.array, // Rikishi names
  handleFilterTextChange: PropTypes.func,
  filterText: PropTypes.string,
  handleClick: PropTypes.func,
};

const RikishiSelection = ({
  rikishiOrOpponent,
  allRikishi,
  options,
  handleFilterTextChange,
  filterText,
  handleClick,
}) => {
  return (
    <div className={styles.rikishiSelection}>
      <h2>{`Select ${rikishiOrOpponent}`}</h2>
      <input value={filterText} onChange={handleFilterTextChange} />
      <div className={styles.nameList}>
        {options.map((rikishiName) => {
          const { image } = allRikishi[rikishiName];
          return (
            <div
              className={styles.rikishiOption}
              key={rikishiName}
              onClick={() => handleClick(rikishiName)}
            >
              <img src={image} alt="rikishi" loading="lazy" />
              <p>{rikishiName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

RikishiSelection.propTypes = prop_info;

export default RikishiSelection;
