module.exports = {
  checkUserinArr(id, arr) {
    if (arr.indexOf(id) !== -1) {
      return true
    } else return false;
  },
  getHokkey2TimeStatInfo(arr) {
    const matches = arr;

    const halfCount = matches.filter(match => match.half && match.coef[0] >= 1.5).length;

    const oneCount = matches.filter(match => match.one && match.coef[1] >= 1.5).length;

    const nonBet = matches.filter(match => match.half && match.coef[0] < 1.5).length;

    const minusCount = matches.length - halfCount - nonBet;

    return {
      halfCount, oneCount, minusCount, matches, nonBet
    }
  },
  getFootballSRStatInfo(arr) {
    const matches = arr;

    const winPlusCount = matches.filter(match => match.win).length;

    const halfPlusCount = matches.filter(match => match.half && match.halfCoef >= 1.5).length;

    const winMinusCount = matches.filter(match => !match.win).length;

    const halfMinusCount = matches.filter(match => !match.half).length;

    return {
      winPlusCount, halfPlusCount, winMinusCount, halfMinusCount, matches
    }
  },
  getBasket23StatInfo(arr) {
    const matches = arr;

    const itbPlusCount = matches.filter(match => match.itb && match.coef >= 1.35).length;

    const itbMinusCount = matches.filter(match => !match.itb).length;

    return {itbPlusCount, itbMinusCount, matches}
  }
};
