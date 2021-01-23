export const toggleColorTheme = () => {
  return dispatch => {
    dispatch({ type: "TOGGLE_COLOR_THEME" });
  }
};
