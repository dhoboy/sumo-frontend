import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  selectRikishiBaseInfo,
  // selectRikishiBaseInfoStatus,
  // selectRikishiBaseInfoErrorMsg,
} from "../../stores/rikishiBaseInfoSlice";
import {
  fetchRikishiRankOverTime,
  selectRikishiRankOverTime,
  // selectRikishiRankOverTimeStatus,
  // selectRikishiRankOverTimeErrorMsg,
} from "../../stores/rikishiRankOverTimeSlice";
import {
  fetchRikishiTechniqueBreakdown,
  selectRikishiTechniqueBreakdown,
  // selectRikishiTechniqueBreakdownStatus,
  // selectRikishiTechniqueBreakdownErrorMsg,
} from "../../stores/rikishiTechniqueBreakdownSlice";
import TechniqueBreakdownTable from "../../components/TechniqueBreakdownTable";
import TechniqueCategoryPieGraph from "../../components/TechniqueCategoryPieGraph";
import { monthMap, formatPercent } from "../../utils";
import styles from "./RikishiDetail.module.css";

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

  console.log("wins_by_technique: ", wins_by_technique);
  console.log("wins_by_technique_category: ", wins_by_technique_category);
  console.log("losses_to_technique: ", losses_to_technique);
  console.log("losses_to_technique_category: ", losses_to_technique_category);

  const rankOverTime = useSelector(
    (state) => selectRikishiRankOverTime(state, { rikishi: name }) ?? {}
  );

  // console.log("rankOverTime: ", rankOverTime);
  // console.log("rank: ", rank);

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
          <h3>{name}</h3>
          <div>
            <p>{`${rank.rank || ""}`}</p>
            <p>
              {`${monthMap[rank.tournament?.month] || ""} ${
                rank.tournament?.year || ""
              }`}
            </p>
          </div>
        </div>
        <div className={styles.technique_breakdown}>
          <div>
            <h3>Wins by Technique Category</h3>
            <TechniqueBreakdownTable data={wins_by_technique_category} />
            <TechniqueCategoryPieGraph data={wins_by_technique_category} />
          </div>
          <div>
            <h3>Wins by Technique</h3>
            <TechniqueBreakdownTable data={wins_by_technique} />
          </div>
          <div>
            <h3>Losses to Technique Category</h3>
            <TechniqueBreakdownTable data={losses_to_technique_category} />
          </div>
          <div>
            <h3>Losses to Technique</h3>
            <TechniqueBreakdownTable data={losses_to_technique} />
          </div>
        </div>
      </header>
      <div>Graphs</div>
    </div>
  );
};

export default RikishiDetail;
