import React from "react";
import { createRoot } from "react-dom/client";
import Dropdown from "../Dropdown";

const options = [
  { value: "name", label: "Name" },
  { value: "technique", label: "Technique" },
  { value: "technique_category", label: "Technique Category" },
];

const selected = "name";
const handleChange = () => {};

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);

  root.render(
    <Dropdown
      label="test"
      selected={selected}
      options={options}
      onChange={handleChange}
    />
  );
});
