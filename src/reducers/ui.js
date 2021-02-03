const initialState = {
  colorTheme: "dark",
};

const ui = (state = initialState, action) => {
  const { type, payload } = action;
  
  switch(type) {
    case "TOGGLE_COLOR_THEME":
      return {
        ...state,
        colorTheme: state.colorTheme === "light" ? "dark" : "light",
      };
    default: 
      return state;
  }
};

export default ui;
