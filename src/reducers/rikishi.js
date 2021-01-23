const initialState = {
  loading: false,
  error: false,
  list: [],
};

const rikishi = (state = initialState, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case "GET_RIKISHI_LOADING":
      return {
        ...state,
        loading: true,
        error: false,
      };
    
    case "GET_RIKISHI_SUCCESS":
      return {
        ...state,
        loading: false,
        error: false,
        list: payload.list,
      };

    case "GET_RIKISHI_ERROR":
      return {
        ...state,
        loading: false,
        error: true,
      };

    default:
      return state;
  }
};

export default rikishi;
