import React from "react";
import { createRoot } from "react-dom/client";
import DisplayTable from "../DisplayTable";

const headers = [
  {
    colKey: "rikishi",
    display: "Rikishi",
    sortType: "string",
    linkFn: () => {},
  },
  {
    colKey: "rank",
    display: "Rank",
    sortKey: "rank_value",
    sortType: "number",
  },
  {
    colKey: "wins",
    display: "Wins",
    sortType: "number",
  },
  {
    colKey: "losses",
    display: "Losses",
    sortType: "number",
  },
  {
    colKey: "result",
    display: "Result",
    sortType: "string",
  },
];

const data = [
  {
    losses: 3,
    rank: "Maegashira #2",
    rank_value: 6,
    result: "kachikoshi",
    results: { wins: 12, losses: 3, result: "kachikoshi" },
    rikishi: "ICHINOJO",
    wins: 12,
  },
];

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(<DisplayTable headers={headers} data={data} />);
});
