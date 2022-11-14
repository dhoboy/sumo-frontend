import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Dropdown.module.css";

const prop_info = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired, // arr of strings or objects with label, value keys
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  fontSize: PropTypes.string, // optional font size of dropdown options
  className: PropTypes.string, // optional className to add so components can customize this further
};

const Dropdown = ({
  label = "",
  options = [],
  selected = "",
  onChange = () => {},
  fontSize = "16px",
  className = "",
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <label
      className={
        className ? `${styles.container} ${className}` : styles.container
      }
      style={{ "--font-size": fontSize }}
    >
      <span>{label}</span>
      <select
        className={styles.dropdown}
        value={selected}
        onChange={handleChange}
      >
        {options.map((option) => {
          const isObj = typeof option === "object";
          const value = isObj ? option.value : option;
          const label = isObj ? option.label : option;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </label>
  );
};

Dropdown.propTypes = prop_info;

export default Dropdown;
