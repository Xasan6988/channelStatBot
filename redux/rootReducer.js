const { ADD_MATCH, FETCH_MATCHES, GET_WINRATE, FETCH_MATCHES_FOR_DATE } = require('./types');

const initializeState = {
  hokkeyMatches: [],
  winrate: {}
};

const rootReducer = (state = initializeState, action) => {
  if (action.type === ADD_MATCH) {
    return {...state, matches: [...state.hokkeyMatches, action.payload]}
  } else if (action.type === FETCH_MATCHES) {
    return {...state, hokkeyMatches: [...action.payload]};
  } else if (action.type === GET_WINRATE) {
    return {...state, winrate: action.payload};
  } else if (action.type === FETCH_MATCHES_FOR_DATE) {
    return {...state, hokkeyMatches: [...action.payload]};
  }
  return state;
};

module.exports = rootReducer;
