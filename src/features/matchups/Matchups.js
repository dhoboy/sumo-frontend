import React, { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { selectAllRikishiBaseInfo } from "../../stores/rikishiBaseInfoSlice";
import { fetchMatchupList } from "../../stores/matchupsSlice";
import RikishiSelection from "./components/RikishiSelection";
import SelectedRikishi from "./components/SelectedRikishi";
import styles from "./Matchups.module.css";

const Matchups = () => {
  const dispatch = useDispatch();
  const allRikishi = useSelector(selectAllRikishiBaseInfo, shallowEqual);

  const [rikishiFilterText, setRikishiFilterText] = useState("");
  const [opponentFilterText, setOpponentFilterText] = useState("");
  const [selectedRikishi, setSelectedRikishi] = useState("");
  const [selectedOpponent, setSelectedOpponent] = useState("");

  const rikishiOptions = Object.keys(allRikishi).filter((rikishiName) => {
    const regex = new RegExp(`^${rikishiFilterText}`, "i");
    return regex.test(rikishiName) && rikishiName !== selectedOpponent;
  });

  const opponentOptions = Object.keys(allRikishi).filter((rikishiName) => {
    const regex = new RegExp(`^${opponentFilterText}`, "i");
    return regex.test(rikishiName) && rikishiName !== selectedRikishi;
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

  const changeRikishi = ({ rikishiOrOpponent }) => {
    if (rikishiOrOpponent === "rikishi") {
      setSelectedRikishi("");
      setRikishiFilterText("");
    } else {
      setSelectedOpponent("");
      setOpponentFilterText("");
    }
  };

  const activeGoButton = selectedRikishi.length && selectedOpponent.length;

  const runSearch = () => {
    dispatch(
      fetchMatchupList({
        rikishi: selectedRikishi,
        opponent: selectedOpponent,
      })
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.ring}>
        {selectedRikishi.length ? (
          <SelectedRikishi
            allRikishi={allRikishi}
            rikishiName={selectedRikishi}
            changeSelection={() =>
              changeRikishi({ rikishiOrOpponent: "rikishi" })
            }
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
        <div className={styles.middleColumn}>
          <h2 className={styles.vs}>VS</h2>
          <button
            className={`${styles.go}${
              activeGoButton ? ` ${styles.active}` : ""
            }`}
            onClick={runSearch}
          >
            GO
          </button>
        </div>
        {selectedOpponent.length ? (
          <SelectedRikishi
            allRikishi={allRikishi}
            rikishiName={selectedOpponent}
            changeSelection={() =>
              changeRikishi({ rikishiOrOpponent: "opponent" })
            }
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
