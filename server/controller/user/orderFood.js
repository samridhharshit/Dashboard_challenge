const mongoose = require("mongoose");

const users = require('../../database/models/users')
const orderRecords = require('../../database/models/orders')
const restaurants = require('../../database/models/restaurant')
const items = require('../../database/models/items')

const orderFood = async (details) => {
    let restaurantId
    // check if token exists or not ie user is logged in or not
    if (
        details.access_token === null ||
        details.access_token === undefined ||
        details.access_token === ""
    ) {
        return {
            status: 403,
            message: "Access forbidden. Login first"
        }
    }

    // find user by token
    const user = await users.findOne({access_token: details.access_token})
    if (!user) {
        return {
            status: 404,
            message: "User does not exist."
        }
    }

    // check if correct format of restaurant id is provided or not
    if (mongoose.Types.ObjectId.isValid(details.restaurantId)) {
        // check if restaurant exists
        const restaurant = await restaurants.findById(`${details.restaurantId}`)
        if (!restaurant) {
            return {
                status: 404,
                message: "Restaurant does not exist."
            }
        }
        // set restaurant id to populate the orders record table
        restaurantId = restaurant._id
    } else {// when incorrect format for restaurant id is provided
        return {
            status: 422,
            message: "Invalid Restaurant Id"
        }
    }

    // check if correct format of food(items) id is provided or not
    if (mongoose.Types.ObjectId.isValid(details.foodId)){
        // check if restaurant exists
        const item = await items.findOne({_id: details.foodId})
        if (!item) {
            return {
                status: 404,
                message: "This dish is no more available."
            }
        }

        // create new order
        const newOrder = new orderRecords({
            restaurantId: restaurantId,
            userId: user._id,
            foodId: item._id
        })
        //save order

        return {
            status: 200,
            data: await newOrder.save(),
            message: "order added!"
        }
    } else {// when incorrect format for restaurant id is provided
        return {
            status: 422,
            message: "Invalid food Id"
        }
    }
}

module.exports = orderFood