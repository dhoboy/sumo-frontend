import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getRikishi } from "../actions/rikishi";
import Loader from "./Loader";
import Table from "./table/Table";

//export const RikishiListContext = React.createContext();

const initialSortState = {
  key: null, // column key to sort on
  direction: "asc", // or "desc"
};

export const RikishiList = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.rikishi.loading);
  const error = useSelector(state => state.rikishi.error);
  const list = useSelector(state => state.rikishi.list, shallowEqual);

  const [sort, setSort] = useState(initialSortState);
  
  useEffect(() => {
    // paginate the api!
    dispatch(getRikishi({ page: 1 }));
  }, [dispatch]);

  const tableHeaders = [
    { colKey: "image", display: null },
    { colKey: "name", display: "Name" },
    { colKey: "current_rank", display: "Current Rank" },
    { colKey: "favorite_food", display: "Favorite Food" },
  ];

  // sort by strings, numbers, dates...
  const displayList = list.sort((a, b) => {
    const { key, direction } = sort;
    if (key) {
      return direction === "asc" ? b[key].localeCompare(a[key]) : a[key].localeCompare(b[key]);
    }
    return 1;
  });

  return (
    <div className="rikishi-list">
      <Loader loading={loading} error={error}>
        <Table
          headers={tableHeaders}
          data={displayList}
          sort={sort}
          setSort={setSort}
        />
      </Loader>
    </div>
  )
};

