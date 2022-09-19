import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { selectAllRikishiBaseInfo } from "../../stores/rikishiBaseInfoSlice";
import RikishiSelection from "./components/RikishiSelection";
import SelectedRikishi from "./components/SelectedRikishi";
import styles from "./Matchups.module.css";

const Matchups = () => {
  const allRikishi = useSelector(selectAllRikishiBaseInfo, shallowEqual);
  console.log("allRikishi: ", allRikishi);

  const [rikishiFilterText, setRikishiFilterText] = useState("");
  const [opponentFilterText, setOpponentFilterText] = useState("");
  const [selectedRikishi, setSelectedRikishi] = useState("");
  const [selectedOpponent, setSelectedOpponent] = useState("");

  const rikishiOptions = Object.keys(allRikishi).filter((rikishiName) => {
    const regex = new RegExp(`^${rikishiFilterText}`, "i");
    return regex.test(rikishiName);
  });

  const opponentOptions = Object.keys(allRikishi).filter((rikishiName) => {
    const regex = new RegExp(`^${opponentFilterText}`, "i");
    return regex.test(rikishiName);
  });

  const handleRikishiTextChange = (e) => {
    setRikishiFilterText(e.target.value);
  };

  const handleOpponentTextChange = (e) => {
    setOpponentFilterText(e.target.value);
  };

  const handleRikishiClick = (rikishiName) => {
    setSelectedRikishi(rikishiName);
  };

  const handleOpponentClick = (rikishiName) => {
    setSelectedOpponent(rikishiName);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.ring}>
        {selectedRikishi.length ? (
          <SelectedRikishi
            allRikishi={allRikishi}
            rikishiName={selectedRikishi}
          />
        ) : (
          <RikishiSelection
            rikishiOrOpponent="rikishi"
            allRikishi={allRikishi}
            options={rikishiOptions}
            handleFilterTextChange={handleRikishiTextChange}
            filterText={rikishiFilterText}
            handleClick={handleRikishiClick}
          />
        )}
        <h2 className={styles.vs}>VS</h2>
        {selectedOpponent.length ? (
          <SelectedRikishi
            allRikishi={allRikishi}
            rikishiName={selectedOpponent}
          />
        ) : (
          <RikishiSelection
            rikishiOrOpponent="opponent"
            allRikishi={allRikishi}
            options={opponentOptions}
            handleFilterTextChange={handleOpponentTextChange}
            filterText={opponentFilterText}
            handleClick={handleOpponentClick}
          />
        )}
      </div>
    </div>
  );
};

export default Matchups;
