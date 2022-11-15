import React from "react";
import { createRoot } from "react-dom/client";
import Checkbox from "../Checkbox";

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  const handleChange = () => {};
  root.render(
    <Checkbox
      filterKey="test"
      label="test"
      checked={true}
      onChange={handleChange}
    />
  );
});
