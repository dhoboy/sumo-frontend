import React from "react";
import { createRoot } from "react-dom/client";
import RikishiList from "./RikishiList";

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(<RikishiList />);
});
