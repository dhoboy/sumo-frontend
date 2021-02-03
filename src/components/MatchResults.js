import React from "react";
import { useSelector } from "react-redux";
// draw everything in tables 
// with lots of filters on it all
// so filter by rikishi, by 2, by tournament, ...

// also could visualize this in some way
// node link of matchups between people, all time
// or each tournament with bubbles 
// where bubble size is # of wins
// to see where tournaments were close 
// or won by a lot.. interesting ideas for this
const MatchResults = () => {
  const match = useSelector(state => state.match);
  return (
    <div>
      MatchResults component
    </div>
  )
};

export default MatchResults;
