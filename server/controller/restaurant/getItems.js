const items = require('../../database/models/items')

const getItems = async (restaurantId) => {
    const foodItems = await items.find({ restaurantId })
    if (foodItems.length === 0) {
        return {
            status: 404,
            message: "There are no items in the dashboard's menu..."
        }
    }
    return {
        status: 200,
        data: foodItems
    }
}

module.exports = getItems