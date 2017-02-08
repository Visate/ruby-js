module.exports = array => {
  let iCurrent = array.length;
  let iRandom;

  while (0 !== iCurrent) {
    iRandom = Math.floor(Math.random() * iCurrent);
    iCurrent--;
    [ array[iCurrent], array[iRandom] ] = [ array[iRandom], array[iCurrent] ];
  }

  return array;
};
