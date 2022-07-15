import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./styles/Header.module.css";

const Header = () => {
  const { pathname } = useLocation();

  const navPaths = [
    { path: "/rikishi", display: "Rikishi" },
    { path: "/tournaments", display: "Tournaments" },
    { path: "/matchups", display: "Matchups" },
  ];

  return (
    <header className={styles.header}>
      <h1 className={styles.h1}>Sumo</h1>
      <nav className={styles.nav}>
        {navPaths.map(({ path, display }) => {
          return (
            <Link
              className={pathname === path ? styles.active : null}
              to={path}
            >
              {display}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
