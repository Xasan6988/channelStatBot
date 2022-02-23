const {FETCH_MATCHES, ADD_MATCH, GET_WINRATE, FETCH_MATCHES_FOR_DATE} = require('./types');

const HokkeyMatch = require('../models/HokkeyMatch');


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

const fetchMatches = () => {
  return async dispatch => {
    try {
      const matches = await HokkeyMatch.find();

      dispatch({type: FETCH_MATCHES, payload: matches});
    } catch (e) {
      throw e;
    }
  };
};

const fetchMatchesForDate = (date) => {
  let dateForQuery;

  if (date < 10) {
    dateForQuery = `0${date}.${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
  } else {
    dateForQuery = `${date}.${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
  }
  return async dispatch => {
    try {

      const matches = await HokkeyMatch.find({date: dateForQuery});

      dispatch({type: FETCH_MATCHES_FOR_DATE, payload: matches});
    } catch (e) {
      throw e;
    }
  }
}

const getWinrate = () => {
  return async dispatch => {
    try {
      const matches = await HokkeyMatch.find();

      const matchesWithHalfCoef = matches.filter(match =>  match.coef[0] >= 1.5).length;
      const matchesWithOneCoef = matches.filter(match =>  match.coef[1] >= 1.5).length;

      const halfPlus = matches.filter(match => match.half && match.coef[0] >= 1.5).length;
      const onePlus = matches.filter(match => match.one && match.coef[1] >= 1.5).length;
      const nonBet = matches.filter(match => match.half && match.coef[0] < 1.5).length;
      const halfMinus = matches.filter(match => !match.half).length;
      const oneMinus = matches.filter(match => !match.one).length;

      // console.log('half plus', halfPlus);
      // console.log('onePlus', onePlus);
      // console.log("halfMinus", halfMinus);
      // console.log('oneMinus', oneMinus);
      // console.log('nonBet', nonBet)
      const WR = {
        half: (halfPlus / matchesWithHalfCoef) * 100,
        one: (onePlus / matchesWithOneCoef) * 100
      }

      dispatch({type: GET_WINRATE, payload: WR});
    } catch (e) {
      throw e
    }
  }
}

module.exports = {
  addHokkeyMatch, fetchMatches, getWinrate, fetchMatchesForDate
}
