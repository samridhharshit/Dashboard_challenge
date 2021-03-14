const restaurant = require('../../database/models/restaurant')
const item = require('../../database/models/items')

const addItemToMenu = async (cred) => {

    let restaurantResponse = await restaurant.findOne({access_token: cred.access_token})
    if (restaurantResponse.length === 0) {
        return {
            status: 401,
            message: "Access Forbidden! Either you have logged in as a customer or not logged in at all."
        }
    }

    const newItem = new item({
        name: cred.name,
        desc: cred.desc,
        price: cred.price,
        type: cred.type,
        restaurantId: restaurantResponse._id
    })

    newItem.save()
    return {
        status: 200,
        message: "Item added successfully!"
    }
}


module.exports = addItemToMenu