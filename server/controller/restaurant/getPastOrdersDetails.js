const mongoose = require("mongoose");

const restaurants = require('../../database/models/restaurant')
const orderRecords = require('../../database/models/orders')
const users = require('../../database/models/users')
const items = require('../../database/models/items')

const getPastOrdersDetails = async (restaurant_access_token) => {

    // check if token exists or not ie user is logged in or not
    if (
        restaurant_access_token === null ||
        restaurant_access_token === undefined ||
        restaurant_access_token === ""
    ) {
        return {
            status: 403,
            message: "Access forbidden. Login first"
        }
    }

    // check if access token is correct
    const restaurant = await restaurants.findOne({access_token: restaurant_access_token})
    if (!restaurant) {
        return {
            status: 404,
            message: "Access token invalid."
        }
    }

    // result array
    const orderHistory = []
    // find all orders that have been made from this dashboard from the orderrecords table
    const records = await orderRecords.find({ restaurantId: restaurant["_id"] }).select('-restaurantId') // fetching all attributes except dashboard id
    // iterating over each order object
    for (let i = 0; i < records.length; i++) {
        // fetch user for every purchase
        const user = await users.findById(`${records[i]["userId"]}`)
        // fetch food item for every purchase
        const dish = await items.findById(`${records[i]["foodId"]}`).select('-restaurantId')

        // check if the user id already exists in the result array
        if (orderHistory.hasOwnProperty(user["_id"])) {
            // if yes, then just push the food item to the  "itemsOrdered array for that particular user"
            user["_id"]["items_ordered"].push(dish)
        } else {
            // if user id is not already added to the  result array,
            // then create key value pair having key as the userid
            // and value consisting of 2 attributes,
            // first the user name and secondly the item that user purchased
            // from that dashboard
            orderHistory.push({
                name: user["name"],
                items_ordered: dish
            })
        }
    }
    // return the final array obtained
    return {
        status: 200,
        data: orderHistory
    }
}

module.exports = getPastOrdersDetails