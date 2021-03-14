const users = require('../../database/models/users')
const restaurant = require('../../database/models/restaurant')
const orderRecords = require('../../database/models/orders')
const items = require('../../database/models/items')
const mongoose = require('mongoose')

const viewOrders = async (access_token, restaurant_id) => {
    // check if token exists or not ie user is logged in or not
    if (access_token === null ||
        access_token === undefined ||
        access_token === ""
    ) {
        return {
            status: 403,
            message: "Access forbidden. Login first"
        }
    }

    // check if access token is correct
    const user = await users.findOne({access_token: access_token})
    console.log(restaurant_id)
    if (Object.keys(user).length !== 0) {
        const res = await orderRecords.find({ userId: user._id, restaurantId: restaurant_id }, async (err, foodIds) => {
            if (err) return { status: 400, message: "error in fetching data" }

            if (foodIds.length === 0) {
                return []
            } else {
                return foodIds
            }
        })

        const food_id_array = []
        for (let j = 0; j < res.length; j++) {
            food_id_array.push(mongoose.Types.ObjectId(res[j].foodId))
        }

        let responseData = await items.find({
            _id: { $in: food_id_array }
        })
        console.log(responseData)
        if (responseData.length !== 0) {
            return {
                status: 200,
                data: responseData
            }
        } else {
            return {
                status: 404,
                message: "You are yet to make your first order. Kindly go back and add a few items to your cart. Thank you"
            }
        }

    } else {
        const outlet = await restaurant.findOne({access_token: access_token})
        if (outlet) {
            return {
                status: 401,
                message: "You are not authorized to view cart! Login as a user to view one."
            }
        } else {
            return {
                status: 404,
                message: "Login credentials invalid. Kindly login first to view the cart"
            }
        }
    }
}

module.exports = viewOrders