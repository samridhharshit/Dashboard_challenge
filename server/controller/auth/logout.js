const user = require('../../database/models/users')
const restaurant = require('../../database/models/restaurant')

const Logout = (type, access_token) => {
    // check if token exists or not ie user is logged in or not
    if (
        access_token === null ||
        access_token === undefined ||
        access_token === ""
    ) {
        return {
            status: 403,
            message: "Access forbidden. Login first"
        }
    }

    let status;
    if (type === "user") {
        status = user.update({ access_token }, { access_token: "" })
    } else {
        status = restaurant.update({ access_token }, { access_token: "" })
    }

    return status
}

module.exports = Logout