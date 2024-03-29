import React from "react";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import { createRoot } from "react-dom/client";
import App from "./App";

test("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
