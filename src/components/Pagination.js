import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Pagination.module.css";

// my convention so I can see prop info at top of the file
const prop_info = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
};

const Pagination = ({ currentPage, totalPages, changePage }) => {
  const handleClick = (p) => {
    let nextPage = p;
    if (p <= 1) {
      nextPage = 1;
    } else if (p >= totalPages) {
      nextPage = totalPages;
    }
    changePage(nextPage);
  };

  return (
    <div className={styles.wrapper}>
      <span
        className={styles.carrot}
        onClick={() => handleClick(+currentPage - 1)}
      >
        &lt;
      </span>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        return (
          <span
            className={`${styles.page} ${
              +page === +currentPage ? styles.active : null
            }`}
            key={page}
            onClick={() => handleClick(page)}
          >
            {page}
          </span>
        );
      })}
      <span
        className={styles.carrot}
        onClick={() => handleClick(+currentPage + 1)}
      >
        &gt;
      </span>
    </div>
  );
};

Pagination.propTypes = prop_info;

export default Pagination;
