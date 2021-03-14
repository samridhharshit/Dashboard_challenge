const mongoose = require('mongoose')
const schema = mongoose.Schema

const restaurantSchema = schema({
    name: String,
    email: String,
    access_token: String,
    type: String,
    food_type: Array,
    desc: String
})

const restaurant = mongoose.model("dashboard", restaurantSchema)

module.exports = restaurant