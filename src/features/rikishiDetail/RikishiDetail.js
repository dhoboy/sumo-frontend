import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchRikishiRankOverTime } from "../../stores/rikishiInfoSlice";

const RikishiDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { name } = params;

  useEffect(() => {
    dispatch(fetchRikishiRankOverTime());
  }, [dispatch]);

  return <div>{`${name}'s rikishi detail mmk`}</div>;
};

export default RikishiDetail;
