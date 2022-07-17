import React from "react";
import styles from "./styles/Checkbox.module.css";

// onChange only needed on the label here, putting on the hidden input
// also to make react console warning go away
const Checkbox = ({ filterKey, label, checked, onChange }) => {
  const handleChange = () => onChange(filterKey);

  return (
    <label className={styles.label} onChange={handleChange}>
      <span>{label}</span>
      <input type="checkbox" onChange={handleChange} checked={checked} />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Checkbox;
