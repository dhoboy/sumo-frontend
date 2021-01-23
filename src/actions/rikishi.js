
// need to implement pagination in the api
export const getRikishi = ({ page = 1 }) => {
  return dispatch => {
    dispatch({ type: "GET_RIKISHI_LOADING" });
    
    // switch to axios
    fetch("http://localhost:3000/rikishi/list").then(resp => {
      return resp.json();
    }).then(resp => {  
      //console.log("resp from rikishi/list: ", resp);
      dispatch({ type: "GET_RIKISHI_SUCCESS", payload: { list: resp }});
    }).catch(error => {
      dispatch({ type: "GET_RIKISHI_ERROR", payload: { error }});  
    });
  }
}
