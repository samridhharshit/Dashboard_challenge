const initState = {
    user: {},
    restaurant: {},
    currentlyLoggedIn: null
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case "MOUNT_USER":
            return {
            ...state,
            user: action.user,
            currentlyLoggedIn: "user"
        }
        case "MOUNT_RESTAURANT": return {
            ...state,
            restaurant: action.restaurant,
            currentlyLoggedIn: "restaurant"
        }
        case "UNMOUNT_USER": return {
            ...state,
            user: {},
            currentlyLoggedIn: null
        }
        case "UNMOUNT_RESTAURANT": return {
            ...state,
            restaurant: {},
            currentlyLoggedIn: null
        }
        default: return state
    }
}

export default rootReducer