import React from "react";

// Renders out each Header Cell in the Header Row
const HeaderCell = ({ colKey, display, sort, setSort }) => {  
  const handleSortClick = () => {
    setSort({
      key: colKey,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleSortDirectionClick = () => {
    setSort({
      ...sort,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="header-entry" onClick={handleSortClick}>
      <span>{display}</span>
      {sort.key === colKey ? <span onClick={handleSortDirectionClick}>sortArrow</span> : null}
    </div>
  );
};

export default HeaderCell;
