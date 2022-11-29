import React from "react";
import { createRoot } from "react-dom/client";
import RikishiDetail from "./RikishiDetail";

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(<RikishiDetail />);
});
