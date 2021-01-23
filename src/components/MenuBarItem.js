import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuBarItem = ({ display, path }) => {
  return (
    <li className="menu-bar-item">
      <NavLink
        activeClassName="current"
        title={display}
        to={path}
      >
        {display}
      </NavLink>
    </li>
  )
};

export default MenuBarItem;
