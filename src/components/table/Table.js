import React from "react";
import HeaderCell from "./HeaderCell";
import Row from "./Row";

/*
 *  Renders out a Table, pass it the following
 *  - headers: [ { colKey: "name", display: "Name", ... }, ... ]
 *  - data:    [ { name: "Takakeisho", ... }, ... ]
 *  - sort:    { key: "name", direction: "asc" }
 *  - setSort: react function to update sort
 */

// add search-ability?
const Table = ({ 
  headers = [], 
  data = [],
  sort,
  setSort,
}) => {
  return (
    <div className="table">
      <ul className="table-headers">
        <li className="header-row">
          {headers.map(({ colKey, display }) => {
            return (
              <HeaderCell
                key={colKey}
                colKey={colKey} 
                display={display}
                sort={sort}
                setSort={setSort}
              />
            );
          })}
        </li>
      </ul>
      <ul className="table-rows">
        {data.map(item => {
          return <Row key={item.id} headers={headers} item={item} />;
        })}
      </ul>
    </div>
  );
};

export default Table;
