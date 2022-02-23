const {
  HOKKEY2TIME_FETCH_MATCHES,
  HOKKEY2TIME_GET_WINRATE,
  HOKKEY2TIME_FETCH_MATCHES_FOR_DATE,
  FOOTBALLSR_FETCH_MATCHES,
  FOOTBALLSR_FETCH_MATCHES_FOR_DATE,
  FOOTBALLSR_GET_WINRATE,
  ADD_MATCH } = require('./types');

const initializeState = {
  hokkeyMatches: [],
  hokkey2timeWinrate: {}
};

const rootReducer = (state = initializeState, action) => {
  if (action.type === ADD_MATCH) {
    return {...state, matches: [...state.hokkeyMatches, action.payload]}
  } else if (action.type === HOKKEY2TIME_FETCH_MATCHES) {
    return {...state, hokkeyMatches: [...action.payload]};
  } else if (action.type === HOKKEY2TIME_GET_WINRATE) {
    return {...state, hokkey2timeWinrate: action.payload};
  } else if (action.type === HOKKEY2TIME_FETCH_MATCHES_FOR_DATE) {
    return {...state, hokkeyMatches: [...action.payload]};
  }
  return state;
};

module.exports = rootReducer;
