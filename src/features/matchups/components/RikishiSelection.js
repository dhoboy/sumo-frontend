import React from "react";
import styles from "./styles/RikishiSelection.module.css";

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

export default RikishiSelection;
