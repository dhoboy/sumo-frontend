import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Checkbox from "../Checkbox";

afterEach(cleanup);

test("renders without crashing", () => {
  const handleChange = () => {};
  render(
    <Checkbox
      filterKey="test"
      label="test"
      checked={true}
      onChange={handleChange}
    />
  );
});

test("toggles between checked and unchecked on click", async () => {
  // state that controls the controlled component
  let checked = false;
  const handleChange = jest.fn(() => {
    checked = !checked;
  });

  const { rerender, getByLabelText } = render(
    <Checkbox
      filterKey="test"
      label="test"
      checked={checked}
      onChange={handleChange}
    />
  );

  // initial render, renders unchecked as expected
  expect(getByLabelText("test").checked).toEqual(false);

  // you clicked, so the checkbox should toggle
  fireEvent.click(getByLabelText("test"));

  rerender(
    <Checkbox
      filterKey="test"
      label="test"
      checked={checked}
      onChange={handleChange}
    />
  );

  // renders checked as expected
  expect(getByLabelText("test").checked).toEqual(true);
});
