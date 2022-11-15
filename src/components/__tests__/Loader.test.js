import React from "react";
import { createRoot } from "react-dom/client";
import Loader from "../Loader";
import Header from "../Header";

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);

  root.render(
    <Loader loading={true} error={false} errorMsg="test" size="medium">
      <Header />
    </Loader>
  );
});
