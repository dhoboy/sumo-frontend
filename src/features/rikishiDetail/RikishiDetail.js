import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectRikishiBaseInfo } from "../../stores/rikishiBaseInfoSlice";
import {
  fetchRikishiRankOverTime,
  selectRikishiRankOverTime,
} from "../../stores/rikishiRankOverTimeSlice";
import {
  fetchRikishiTechniqueBreakdown,
  selectRikishiTechniqueBreakdown,
} from "../../stores/rikishiTechniqueBreakdownSlice";
import TechniqueBreakdownTable from "../../components/TechniqueBreakdownTable";
import TechniqueCategoryPieGraph from "../../components/TechniqueCategoryPieGraph";
import TechniqueBarGraph from "../../components/TechniqueBarGraph";
import RankOverTimeLineGraph from "../../components/RankOverTimeLineGraph";
import { monthMap } from "../../utils";
import styles from "./RikishiDetail.module.css";

// Component takes no props
const prop_info = {};

const RikishiDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { name } = params;

  const { image, rank = {} } = useSelector(
    (state) => selectRikishiBaseInfo(state, { rikishi: name }) ?? {}
  );

  const {
    wins_by_technique = [],
    wins_by_technique_category = [],
    losses_to_technique = [],
    losses_to_technique_category = [],
  } = useSelector(
    (state) => selectRikishiTechniqueBreakdown(state, { rikishi: name }) ?? {}
  );

  const top_ten_wins_by_technique = wins_by_technique
    .slice()
    .sort((a, b) => b.count - a.count)
    .filter((_, i) => i < 10);

  const top_ten_losses_to_technique = losses_to_technique
    .slice()
    .sort((a, b) => b.count - a.count)
    .filter((_, i) => i < 10);

  const rankOverTime = useSelector(
    (state) => selectRikishiRankOverTime(state, { rikishi: name }) ?? {}
  );

  // scroll to top of page on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // load rikishi data needed for this page
  useEffect(() => {
    dispatch(fetchRikishiRankOverTime({ rikishi: name }));
    dispatch(fetchRikishiTechniqueBreakdown({ rikishi: name }));
  }, [dispatch, name]);

  return (
    <div className={styles.container}>
      <header>
        <div className={styles.info}>
          <img className={styles.headshot} src={image} alt={`${name}`} />
          <h2>{name}</h2>
          <div>
            <p>{`${rank.rank || ""}`}</p>
            <p>
              {`${monthMap[rank.tournament?.month] || ""} ${
                rank.tournament?.year || ""
              }`}
            </p>
          </div>
        </div>
        <div className={styles.rank_over_time}>
          <h2>Rank History</h2>
          <RankOverTimeLineGraph data={rankOverTime} />
        </div>
      </header>
      <div className={styles.technique_breakdown}>
        <div className={styles.breakdown_row}>
          <div className={styles.category}>
            <h2>Wins by Technique Category</h2>
            <TechniqueCategoryPieGraph data={wins_by_technique_category} />
          </div>
          <div className={styles.category}>
            <h2>Losses to Technique Category</h2>
            <TechniqueCategoryPieGraph data={losses_to_technique_category} />
          </div>
        </div>
        <div className={styles.breakdown_row}>
          <div className={styles.technique}>
            <h2>Top Wins by Technique</h2>
            <TechniqueBarGraph
              yLabel="Win Percentage"
              data={top_ten_wins_by_technique}
            />
          </div>
          <div className={`${styles.technique} ${styles.techniqueWins}`}>
            <h2>Top Losses to Technique</h2>
            <TechniqueBarGraph
              yLabel="Defeat Percentage"
              data={top_ten_losses_to_technique}
            />
          </div>
        </div>
        <div className={styles.breakdown_row}>
          <div className={styles.technique}>
            <h2>All Wins by Technique</h2>
            <TechniqueBreakdownTable data={wins_by_technique} />
          </div>
          <div className={`${styles.technique} ${styles.techniqueLosses}`}>
            <h2>All Losses to Technique</h2>
            <TechniqueBreakdownTable data={losses_to_technique} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RikishiDetail;
