import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Checkbox.module.css";

const prop_info = {
  filterKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired, // true or false
  onChange: PropTypes.func.isRequired,
};

const Checkbox = ({ filterKey, label, checked, onChange }) => {
  const handleChange = () => onChange(filterKey);

  return (
    <label className={styles.label}>
      <span>{label}</span>
      <input type="checkbox" onChange={handleChange} checked={checked} />
      <span className={styles.checkmark}></span>
    </label>
  );
};

Checkbox.propTypes = prop_info;

export default Checkbox;
