const routes = require('express').Router();
const request = require('request-promise-native');

routes.get('/', (req, res) => {
  getCalories(foodName, isSoup)
});

function getCalories(foodName, isSoup) {
  const queryString = isSoup === true ? "500 grams " + foodName + " soup" : foodName;
  return request.post({
    uri: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    headers: {
      'x-app-id': '70f872c0',
      'x-app-key': '1dc3bfcfe831beb1435e46191e1bb5a8',
    },
    body: {
      query: queryString
    },
    json: true
  })
  .then((food) => {
    const calories = sumCalories(food.foods);
    return calories;
  })
  .catch(() => {
    return 'N/A';
  })
}

const sumCalories = (foods) => {
  let sum = 0;
  foods.forEach(food => {
    sum += food.nf_calories;
  });
  return sum;
}
module.exports = {
  getCalories
};
