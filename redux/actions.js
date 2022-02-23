const {
  HOKKEY2TIME_FETCH_MATCHES,
  ADD_MATCH,
  HOKKEY2TIME_GET_WINRATE,
  HOKKEY2TIME_FETCH_MATCHES_FOR_DATE,
  FOOTBALLSR_FETCH_MATCHES,
  FOOTBALLSR_FETCH_MATCHES_FOR_DATE,
  FOOTBALLSR_GET_WINRATE
} = require('./types');

const HokkeyMatch = require('../models/HokkeyMatch');
const FootbalSRMatch = require('../models/FootbalSRMatch');

const addHokkeyMatch = (match) => {
  return async dispatch => {
    try {
      const newMatch = await new HokkeyMatch(match);

      await newMatch.save();

      dispatch({type: ADD_MATCH, payload: newMatch});
    } catch (e) {
      throw e;
    }
  };
};

const addFootbalSRMatch = (match) => {
  return async dispatch => {
    try {
      const newMatch = await new FootbalSRMatch(match);

      await newMatch.save();

      dispatch({type: ADD_MATCH, payload: newMatch});
    } catch (e) {
      throw e;
    }
  };
}

const hokkey2timeFetchMatches = () => {
  return async dispatch => {
    try {
      const matches = await HokkeyMatch.find();

      dispatch({type: HOKKEY2TIME_FETCH_MATCHES, payload: matches});
    } catch (e) {
      throw e;
    }
  };
};

const footballSRFetchMatches = () => {
  return async dispatch => {
    try {
      const matches = await FootbalSRMatch.find();

      dispatch({type: FOOTBALLSR_FETCH_MATCHES, payload: matches});
    } catch (e) {
      throw e;
    }
  };
};

const hokkey2timeFetchMatchesForDate = (date) => {
  let dateForQuery;

  if (date < 10) {
    dateForQuery = `0${date}.${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
  } else {
    dateForQuery = `${date}.${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
  }
  return async dispatch => {
    try {

      const matches = await HokkeyMatch.find({date: dateForQuery});

      dispatch({type: HOKKEY2TIME_FETCH_MATCHES_FOR_DATE, payload: matches});
    } catch (e) {
      throw e;
    }
  };
};

const footballSRFetchMatchesForDate = (date) => {
  let dateForQuery;

  if (date < 10) {
    dateForQuery = `0${date}.${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
  } else {
    dateForQuery = `${date}.${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
  }
  return async dispatch => {
    try {

      const matches = await FootbalSRMatch.find({date: dateForQuery});

      dispatch({type: FOOTBALLSR_FETCH_MATCHES_FOR_DATE, payload: matches});
    } catch (e) {
      throw e;
    }
  };
}

const hokkey2timeGetWinrate = () => {
  return async dispatch => {
    try {
      const matches = await HokkeyMatch.find();

      const matchesWithHalfCoef = matches.filter(match =>  match.coef[0] >= 1.5).length;
      const matchesWithOneCoef = matches.filter(match =>  match.coef[1] >= 1.5).length;

      const halfPlus = matches.filter(match => match.half && match.coef[0] >= 1.5).length;
      const onePlus = matches.filter(match => match.one && match.coef[1] >= 1.5).length;

      const WR = {
        half: (halfPlus / matchesWithHalfCoef) * 100,
        one: (onePlus / matchesWithOneCoef) * 100
      }

      dispatch({type: HOKKEY2TIME_GET_WINRATE, payload: WR});
    } catch (e) {
      throw e
    }
  }
}

const footballSRGetWinrate = () => {
  return async dispatch => {
    try {
      const matches = await FootbalSRMatch.find();

      const winPlus = matches.filter(match => match.win).length;
      const halfPlus = matches.filter(match => match.half).length;

      const WR = {
        win: (winPlus / matches.length) * 100,
        half: (halfPlus / matches.length) * 100
      }

      dispatch({type: HOKKEY2TIME_GET_WINRATE, payload: WR});
    } catch (e) {
      throw e
    }
  }
}

module.exports = {
  addHokkeyMatch,
  hokkey2timeFetchMatches,
  hokkey2timeGetWinrate,
  hokkey2timeFetchMatchesForDate,
  addFootbalSRMatch,
  footballSRFetchMatches,
  footballSRFetchMatchesForDate,
  footballSRGetWinrate
}
