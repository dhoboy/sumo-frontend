import React from "react";
import { createRoot } from "react-dom/client";
import Pagination from "../Pagination";

const handleChange = () => {};

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);

  root.render(
    <Pagination currentPage={1} totalPages={10} changePage={handleChange} />
  );
});
