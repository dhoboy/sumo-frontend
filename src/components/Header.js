import React from "react";
import { Link } from "react-router-dom";
import "./styles/Header.module.css";

const Header = () => {
  return (
    <header>
      <h1>Sumo</h1>
      <nav>
        <Link to="/rikishi">Rikishi</Link>
        <Link to="/tournaments">Tournaments</Link>
        <Link to="/matchups">Matchups</Link>
      </nav>
    </header>
  );
};

export default Header;
