const {
  HOKKEY2TIME_FETCH_MATCHES,
  HOKKEY2TIME_GET_WINRATE,
  HOKKEY2TIME_FETCH_MATCHES_FOR_DATE,
  FOOTBALLSR_FETCH_MATCHES,
  FOOTBALLSR_FETCH_MATCHES_FOR_DATE,
  FOOTBALLSR_GET_WINRATE,
  ADD_MATCH,
  BASKET23_FETCH_MATCHES,
  BASKET23_GET_WINRATE,
  BASKET23_FETCH_MATCHES_FOR_DATE} = require('./types');

const initializeState = {
  hokkeyMatches: [],
  hokkey2timeWinrate: {},
  footballSRMatches: [],
  footballSRWinrate: {},
  basket23Matches: [],
  basket23Winrate: {}
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
  } else if (action.type === FOOTBALLSR_FETCH_MATCHES) {
    return {...state, footballSRMatches: [...action.payload]};
  } else if (action.type === FOOTBALLSR_FETCH_MATCHES_FOR_DATE) {
    return {...state, footballSRMatches: [...action.payload]};
  } else if (action.type === FOOTBALLSR_GET_WINRATE) {
    return {...state, footballSRWinrate: action.payload};
  } else if (action.type === BASKET23_FETCH_MATCHES) {
    return {...state, basket23Matches: [...action.payload]};
  } else if (action.type === BASKET23_FETCH_MATCHES_FOR_DATE) {
    return {...state, basket23Matches: [...action.payload]};
  } else if (action.type === BASKET23_GET_WINRATE) {
    return {...state, basket23Winrate: action.payload}
  }
  return state;
};

module.exports = rootReducer;
