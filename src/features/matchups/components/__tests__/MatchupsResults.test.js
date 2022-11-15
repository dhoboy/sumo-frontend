import React from "react";
import { createRoot } from "react-dom/client";
import MatchupsResults from "../components/MatchupsResults";

const data = [
  {
    day: 8,
    east: "TAKAKEISHO",
    east_rank: "Sekiwake",
    east_rank_value: 3,
    id: 111,
    is_playoff: null,
    loser: "ENDO",
    month: 3,
    technique: "Tsukidashi",
    technique_category: "push",
    technique_en: "Frontal thrust out",
    west: "ENDO",
    west_rank: "Maegashira #1",
    west_rank_value: 5,
    winner: "TAKAKEISHO",
    year: 2019,
  },
];

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);

  root.render(
    <MatchupsResults rikishi="ENDO" opponent="TAKAKEISHO" data={data} />
  );
});
