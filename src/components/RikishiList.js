import { shallowEqual } from "@babel/types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRikishi } from "../actions/rikishi";
import RikishiListItem from "./RikishiListItem";
import Loader from "./Loader";

const RikishiList = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.rikishi.loading);
  const error = useSelector(state => state.rikishi.error);
  const list = useSelector(state => state.rikishi.list, shallowEqual);

  useEffect(() => {
    // paginate the api!
    dispatch(getRikishi({ page: 1 }));
  }, [dispatch]);

  return (
    <div className="rikishi-list">
      <Loader loading={loading} error={error}>
        {list.map(data => {
          return <RikishiListItem key={data.id} {...data} />;
        })}
      </Loader>
    </div>
  )
};

export default RikishiList;
