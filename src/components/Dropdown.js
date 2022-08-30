import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Dropdown.module.css";

const prop_info = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired, // arr of strings
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Dropdown = ({
  label = "",
  options = [],
  selected = "",
  onChange = () => {},
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <label className={styles.container}>
      <span>{label}</span>
      <select
        className={styles.dropdown}
        value={selected}
        onChange={handleChange}
      >
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </label>
  );
};

Dropdown.propTypes = prop_info;

export default Dropdown;
