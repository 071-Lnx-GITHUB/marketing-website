// If country = USA|usa, return State, otherwise return Country
// Used for partner locations
module.exports = function stateCountry (state, country)  {
  if (!country) {
    return state;
  }
  if (country === 'usa' || country === 'USA') {
    return state;
  }
  return country;
};
