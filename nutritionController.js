const routes = require('express').Router();
const request = require('request-promise-native');

routes.get('/', (req, res) => {
  getCalories(foodName, isSoup)
});

function getCalories(foodName, isSoup) {
  const queryString = isSoup === true ? "500 grams" + foodName + "soup" : foodName;
  console.log(queryString);
  return request.post({
    uri: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    headers: {
      'x-app-id': '6a377e5b',
      'x-app-key': '7a491a27adefa9981b7e9a51af67b80a',
    },
    body: {
      query: queryString
    },
    json: true
  })
  .then((food) => {
    const calories = sumCalories(food.foods);
    return calories;
  });
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
