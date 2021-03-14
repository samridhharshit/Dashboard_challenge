const mongoose = require('mongoose')
const schema = mongoose.Schema

const ordersSchema = schema({
    restaurantId: String,
    userId: String,
    foodId: String
})

module.exports = mongoose.model("orderRecords", ordersSchema)
