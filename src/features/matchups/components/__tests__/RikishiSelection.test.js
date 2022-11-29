import React from "react";
import { createRoot } from "react-dom/client";
import RikishiSelection from "../RikishiSelection";

const allRikishi = {
  SHODAI: {
    id: 1,
    image:
      "https://www3.nhk.or.jp/nhkworld/en/tv/sumo/wrestlers/21/images/shodai_2.png",
    name: "SHODAI",
    name_ja:
      "https://www3.nhk.or.jp/nhkworld/en/tv/sumo/wrestlers/11/images/shodai_ja.png",
    rank: {
      rank: "Ozeki",
      rank_value: 2,
      tournament: { month: 9, year: 2022 },
    },
  },
  HAKUHO: {
    id: 3,
    image:
      "https://www3.nhk.or.jp/nhkworld/en/tv/sumo/wrestlers/4/images/hakuho_2.png",
    name: "HAKUHO",
    name_ja:
      "https://www3.nhk.or.jp/nhkworld/en/tv/sumo/wrestlers/4/images/hakuho_ja.png",
    rank: {
      rank: "Yokozuna",
      rank_value: 1,
      tournament: { month: 7, year: 2021 },
    },
  },
};

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);

  root.render(
    <RikishiSelection
      rikishiOrOpponent="rikishi"
      allRikishi={allRikishi}
      options={["SHODAI", "HAKUHO"]}
      handleFilterTextChange={() => {}}
      filterText={""}
      handleClick={() => {}}
    />
  );
});
