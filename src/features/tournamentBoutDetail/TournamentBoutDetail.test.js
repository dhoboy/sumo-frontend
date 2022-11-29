import React from "react";
import { createRoot } from "react-dom/client";
import TournamentBoutDetail from "./TournamentBoutDetail";

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(<TournamentBoutDetail />);
});
