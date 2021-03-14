const user = require('../../database/models/users')
const restaurant = require('../../database/models/restaurant')

const register = async (credentials) => {
    console.log(credentials)
    const isARestaurant = await restaurant.find({email: credentials.email})
    const isAUser = await user.find({email: credentials.email})
    if (credentials.type === "user") {
        if (isARestaurant.length > 0) {
            return {
                status: 409,
                message: "user already exists as Restaurant. Please use another email."
            }
        }
        if (isAUser.length > 0) {
            return {
                status: 409,
                message: "user already exists as a customer. Please use another email."
            }
        }
        const newUser = new user(credentials)
        return {
            status: 200,
            response: await newUser.save()
        }
    } else if (credentials.type === "dashboard"){
        if (isAUser.length > 0) {
            return {
                status: 409,
                message: "user already exists as a customer. Please use another email."
            }
        }
        if (isARestaurant.length > 0) {
            return {
                status: 409,
                message: "user already exists as Restaurant. Please use another email."
            }
        }
        const newRestaurant = new restaurant(credentials)
        return {
            status: 200,
            response: await newRestaurant.save()
        }
    } else {
        return {
            status: 401,
            message: "not a valid type. Kindly specify the type of user you are. Thank you"
        }
    }
}

module.exports = register