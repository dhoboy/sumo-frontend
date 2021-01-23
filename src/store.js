import {
  createStore, 
  combineReducers, 
  applyMiddleware,
} from "redux";

import thunk from "redux-thunk";
import logger from "redux-logger";

import match from "./reducers/match";
import rikishi from "./reducers/rikishi";
import ui from "./reducers/ui";

let middleware = [thunk];

if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

const store = createStore(
  combineReducers({
    match,
    rikishi,
    ui,
  }),
  applyMiddleware(...middleware)
);

export default store;
