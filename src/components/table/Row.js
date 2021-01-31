import React from "react";

// Renders out a Row and all Cells in that Row
const Row = ({ headers, item }) => {
  return (
    <li className="data-row">
      {headers.map(({ colKey }) => {
        // render out an image for this table cell
        if (colKey === "image") {
          return (
            <div key={`${item.id}-${colKey}`} className="data-entry image">
              <div className="img" style={{ backgroundImage: `url(https://www3.nhk.or.jp${item.image})` }}></div>
            </div>
          );
        }
        // otherwise, render out a text table cell
        return (
          <div key={`${item.id}-${colKey}`} className="data-entry">
            {item[colKey] || "Chanko Nabe"}
          </div>
        );
      })}
    </li>
  );
};

export default Row;
