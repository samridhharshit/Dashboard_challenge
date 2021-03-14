const restaurants = require('../../database/models/restaurant')

const getAllRestaurants = () => {
    return restaurants.find({})
}

module.exports = getAllRestaurants