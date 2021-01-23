import React from "react";

const Loader = (props) => {
  const { 
    loading = false, 
    error = false, 
    children,
  } = props;
  
  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
      </div>
    )
  } else if (error) {
    return (
      <h2 className="error">
        Oh No! Can't load right now. Please try again later!
      </h2>
    );
  } else {
    return children;
  }

};

export default Loader;
