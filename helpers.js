module.exports = {
  checkUserinArr(id, arr) {
    if (arr.indexOf(id) !== -1) {
      return true
    } else return false;
  },
  getStatInfo(arr) {
    const matches = arr;

    const halfCount = matches.filter(match => match.half && match.coef[0] >= 1.5).length;

    const oneCount = matches.filter(match => match.one && match.coef[1] >= 1.5).length;

    const nonBet = matches.filter(match => match.half && match.coef[0] < 1.5).length;

    const minusCount = matches.length - halfCount - nonBet;

    return {
      halfCount, oneCount, minusCount, matches, nonBet
    }
  }
};
