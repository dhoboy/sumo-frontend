import React from "react";

const RikishiListItem = ({ image, name, name_ja }) => {
  // draw a table: name, current rank, total wins, when available: debut, ...
  // sortable on the different metrics, paginated
  // add a search bar too
  // maybe a trend line of how their rank has changed over time
  // trending up, holding... some way to signify yokozuna... maybe a pyramid drawing.. not sure yet
  return (
    <div className="rikishi-list-item">
      <div className="img" style={{ backgroundImage: `url(https://www3.nhk.or.jp${image})` }}></div>
      <span className="name">{name}</span>
    </div>
  );
};

export default RikishiListItem;
