import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log("error: ", error);
    return { hasError: true };
  }

  // componentDidCatch(error, errorInfo) {
  //   // You can also log the error to an error reporting service
  //   logErrorToMyService(error, errorInfo);
  // }

  render() {
    if (this.state.hasError) {
      return (
        <h2 className="error">
          {this.props.message || "Something went wrong! Please try again later!"}
        </h2>
      );
    }

    return this.props.children; 
  }
};

export default ErrorBoundary;
