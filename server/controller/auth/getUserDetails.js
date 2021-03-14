const users = require('../../database/models/users')
const restaurant = require('../../database/models/restaurant')

const getUserDetails = async (access_token) => {
    console.log(access_token)
    let token = access_token
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
    const user = await users.findOne({access_token: token})
    console.log("user", user)
    if (user) {
        return {
            status: 200,
            data: user
        }
    } else {
        token = access_token
        const outlet = await restaurant.findOne({access_token: token})
        if (outlet) {
            return {
                status: 200,
                data: outlet
            }
        } else {
            return {
                status: 404,
                message: "Access token invalid."
            }
        }
    }

}

module.exports = getUserDetails