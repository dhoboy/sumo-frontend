import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDLE, LOADING, SUCCESS, FAILED } from "../../constants.js";
import { Link } from "react-router-dom";
import {
  fetchRikishiList,
  selectRikishiList,
  selectRikishiListStatus,
  selectRikishiListErrorMsg,
} from "../../stores/rikishiInfoSlice";
import Loader from "../../components/Loader";
import styles from "./RikishiList.module.css";

const RikishiList = () => {
  const dispatch = useDispatch();

  const status = useSelector((state) => selectRikishiListStatus(state));
  const data = useSelector((state) => selectRikishiList(state));
  const errorMsg = useSelector((state) => selectRikishiListErrorMsg(state));

  useEffect(() => {
    // data is still being fetched twice...
    if (!data.length && status !== LOADING) {
      dispatch(fetchRikishiList());
    }
  }, [data, dispatch, status]);

  return (
    <Loader
      loading={status === LOADING || status === IDLE}
      error={false}
      errorMsg={errorMsg}
    >
      <div className={styles.wrapper}>
        {data.map((rikishi) => {
          return <div>{rikishi}</div>;
        })}
      </div>
    </Loader>
  );
};

export default RikishiList;
