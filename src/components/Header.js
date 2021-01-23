import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleColorTheme } from "../actions/ui";
import Toggle from "react-toggle";

const Header = () => {
  const dispatch = useDispatch();
  const colorTheme = useSelector(state => state.ui.colorTheme);
  const handleChange = () => dispatch(toggleColorTheme());
  
  return (
    <h1 className="header">
      <span>Sumo</span>
      <Toggle
        checked={colorTheme === "light"}
        onChange={handleChange}
        icons={{
          checked: <i className="fas fa-circle"></i>,
          unchecked: <i className="fas fa-moon"></i>,
        }}
      />
    </h1>
  )
};

export default Header;
