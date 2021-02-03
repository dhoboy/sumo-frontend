import React from "react";

// Renders out each Header Cell in the Header Row
const HeaderCell = ({ colKey, display, sort, setSort }) => {  
  const handleSortClick = () => {
    setSort({
      key: colKey,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="header-entry" onClick={handleSortClick}>
      <span>{display}</span>
      {sort.key === colKey ? (
        <span key={sort.direction}>
          <i className={`fas fa-sort-alpha-${sort.direction === "asc" ? "up" : "down-alt"}`}></i>
        </span>
       ) : null}
    </div>
  );
};

export default HeaderCell;
