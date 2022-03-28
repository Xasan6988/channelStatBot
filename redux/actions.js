const {
  HOKKEY2TIME_FETCH_MATCHES,
  ADD_MATCH,
  HOKKEY2TIME_GET_WINRATE,
  HOKKEY2TIME_FETCH_MATCHES_FOR_DATE,
  FOOTBALLSR_FETCH_MATCHES,
  FOOTBALLSR_FETCH_MATCHES_FOR_DATE,
  FOOTBALLSR_GET_WINRATE,
  BASKET23_FETCH_MATCHES,
  BASKET23_FETCH_MATCHES_FOR_DATE,
  BASKET23_GET_WINRATE
} = require('./types');

const Hokkey2timeMatch = require('../models/Hokkey2timeMatch');
const FootballSRMatch = require('../models/FootballSRMatch');
const Basket23Match = require('../models/Basket23Match');

const addHokkeyMatch = (match) => {
  return async dispatch => {
    try {
      const newMatch = await new Hokkey2timeMatch(match);

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
      const newMatch = await new FootballSRMatch(match);

      await newMatch.save();

      dispatch({type: ADD_MATCH, payload: newMatch});
    } catch (e) {
      throw e;
    }
  };
};

const addBasket23Match = (match) => {
  return async dispatch => {
    try {
      const newMatch = await new Basket23Match(match);

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
      const matches = await Hokkey2timeMatch.find();

      dispatch({type: HOKKEY2TIME_FETCH_MATCHES, payload: matches});
    } catch (e) {
      throw e;
    }
  };
};

const footballSRFetchMatches = () => {
  return async dispatch => {
    try {
      const matches = await FootballSRMatch.find();

      dispatch({type: FOOTBALLSR_FETCH_MATCHES, payload: matches});
    } catch (e) {
      throw e;
    }
  };
};

const basket23FetchMatches = () => {
  return async dispatch => {
    try {
      const matches = await Basket23Match.find();

      dispatch({type: BASKET23_FETCH_MATCHES, payload: matches});
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

      const matches = await Hokkey2timeMatch.find({date: dateForQuery});

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

      const matches = await FootballSRMatch.find({date: dateForQuery});

      dispatch({type: FOOTBALLSR_FETCH_MATCHES_FOR_DATE, payload: matches});
    } catch (e) {
      throw e;
    }
  };
};

const basket23FetchMatchesForDate = (date) => {
  let dateForQuery;

  if (date < 10) {
    dateForQuery = `0${date}.${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
  } else {
    dateForQuery = `${date}.${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
  }
  return async dispatch => {
    try {

      const matches = await Basket23Match.find({date: dateForQuery});

      dispatch({type: BASKET23_FETCH_MATCHES_FOR_DATE, payload: matches});
    } catch (e) {
      throw e;
    }
  };
};

const hokkey2timeGetWinrate = () => {
  return async dispatch => {
    try {
      const matches = await Hokkey2timeMatch.find();

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
};

const footballSRGetWinrate = () => {
  return async dispatch => {
    try {
      const matches = await FootballSRMatch.find();

      const winPlus = matches.filter(match => match.win).length;
      const halfPlus = matches.filter(match => match.half).length;

      const WR = {
        win: (winPlus / matches.length) * 100,
        half: (halfPlus / matches.length) * 100
      }

      dispatch({type: FOOTBALLSR_GET_WINRATE, payload: WR});
    } catch (e) {
      throw e
    }
  }
};

const basket23GetWinrate = () => {
  return async dispatch => {
    try {
      const matches = await Basket23Match.find();

      const itbPlus = matches.filter(match => match.itb && match.coef >= 1.35).length;

      const WR = {
        itb: (itbPlus / matches.length) * 100,
      }

      dispatch({type: BASKET23_GET_WINRATE, payload: WR});
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
  footballSRGetWinrate,
  addBasket23Match,
  basket23FetchMatches,
  basket23FetchMatchesForDate,
  basket23GetWinrate
}
