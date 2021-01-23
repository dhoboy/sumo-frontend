import React from "react";
import MenuBarItem from "./MenuBarItem";

const MenuBar = () => {
  return (
    <ul className="menu-bar">
      <MenuBarItem display="Rikishi" path="/rikishi" />
      <MenuBarItem display="Match Results" path="/match-results" />
    </ul>
  );
};

export default MenuBar;
