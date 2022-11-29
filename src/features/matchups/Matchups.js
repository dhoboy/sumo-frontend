import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  selectAllRikishiBaseInfo,
  selectRikishiBaseInfoStatus,
  selectRikishiBaseInfoErrorMsg,
} from "../../stores/rikishiBaseInfoSlice";
import { LOADING, FAILED } from "../../constants.js";
import {
  fetchMatchupList,
  selectAllMatchups,
  selectMatchupsStatus,
  selectMatchupsErrorMsg,
} from "../../stores/matchupsSlice";
import RikishiSelection from "./components/RikishiSelection";
import SelectedRikishi from "./components/SelectedRikishi";
import MatchupsResults from "./components/MatchupsResults";
import Loader from "../../components/Loader";
import styles from "./Matchups.module.css";

// Component takes no props
const prop_info = {};

const Matchups = () => {
  const dispatch = useDispatch();
  const allRikishi = useSelector(selectAllRikishiBaseInfo, shallowEqual);
  const rikishiBaseInfoStatus = useSelector(selectRikishiBaseInfoStatus);
  const rikishiBaseInfoErrorMsg = useSelector(selectRikishiBaseInfoErrorMsg);
  const allMatchups = useSelector(selectAllMatchups);
  const matchupsStatus = useSelector(selectMatchupsStatus);
  const matchupsErrorMsg = useSelector(selectMatchupsErrorMsg);

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

  const matchupData = (() => {
    const matchupKey1 = `${selectedRikishi.toUpperCase()}-${selectedOpponent.toUpperCase()}`;
    const matchupKey2 = `${selectedOpponent.toUpperCase()}-${selectedRikishi.toUpperCase()}`;
    return allMatchups[matchupKey1] || allMatchups[matchupKey2];
  })();

  // scroll to top of page on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedRikishi.length && selectedOpponent.length && !matchupData) {
      dispatch(
        fetchMatchupList({
          rikishi: selectedRikishi,
          opponent: selectedOpponent,
        })
      );
    }
  }, [dispatch, matchupData, selectedOpponent, selectedRikishi]);

  const changeRikishi = ({ rikishiOrOpponent }) => {
    if (rikishiOrOpponent === "rikishi") {
      setSelectedRikishi("");
      setRikishiFilterText("");
    } else {
      setSelectedOpponent("");
      setOpponentFilterText("");
    }
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
          <Loader
            loading={rikishiBaseInfoStatus === LOADING}
            error={rikishiBaseInfoStatus === FAILED}
            errorMsg={rikishiBaseInfoErrorMsg}
            size="small"
          >
            <RikishiSelection
              rikishiOrOpponent="rikishi"
              allRikishi={allRikishi}
              options={rikishiOptions}
              handleFilterTextChange={handleRikishiTextChange}
              filterText={rikishiFilterText}
              handleClick={handleRikishiClick}
            />
          </Loader>
        )}
        <div className={styles.middleColumn}>
          <h2 className={styles.vs}>VS</h2>
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
          <Loader
            loading={rikishiBaseInfoStatus === LOADING}
            error={rikishiBaseInfoStatus === FAILED}
            errorMsg={rikishiBaseInfoErrorMsg}
            size="small"
          >
            <RikishiSelection
              rikishiOrOpponent="opponent"
              allRikishi={allRikishi}
              options={opponentOptions}
              handleFilterTextChange={handleOpponentTextChange}
              filterText={opponentFilterText}
              handleClick={handleOpponentClick}
            />
          </Loader>
        )}
      </div>
      <Loader
        loading={matchupsStatus === LOADING}
        error={matchupsStatus === FAILED}
        errorMsg={matchupsErrorMsg}
        className={styles.matchupsResultsWrapper}
        size="small"
      >
        <MatchupsResults
          rikishi={selectedRikishi}
          opponent={selectedOpponent}
          matchupData={matchupData}
        />
      </Loader>
    </div>
  );
};

export default Matchups;
