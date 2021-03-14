import React, {useEffect, useState} from 'react'
import { useParams } from "react-router-dom";
import { Alert, Button } from "reactstrap";
import axios from 'axios'
import { connect } from 'react-redux'
import AddDishToCartModal from "../modals/addDishToCart";
import * as firebase from "firebase";

function RestaurantMenu() {
    let { id } = useParams()

    const [loading, setLoading] = useState(true)
    const [addDishToMenuModal, setAddDishToMenuModal] = useState(false)
    const [addDishToCartModal, setAddDishToCartModal] = useState(false)
    const [menuList , setMenuList] = useState(null)
    const [emptyMenuMessage, setEmptyMenuMessage] = useState(null)
    const [visible, setVisible] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [itemName, setItemName] = useState(null)
    const [errorInCartAdditionMessage, setErrorInCartAdditionMessage] = useState(null)
    const [openToAddDish, setOpenToAddDish] = useState(false)

    const onDismiss = () => setVisible(false);
    const onErrorDismiss = () => setErrorVisible(false)

    const addDishToMenuToggle = () => setAddDishToMenuModal(!addDishToMenuModal)
    const addDishToCartToggle = () => setAddDishToCartModal(!addDishToCartModal)
    const openMenuToggle = () => setOpenToAddDish(!openToAddDish)



    // implements when component mounts
    useEffect(() => {
        async function getItems() {
            // fetch all items for a restaurant
            const response = await axios.get(`/api/restaurant/get_items/${id}`)
            if (response.data.status === 200) {
                // set the menu list
                await setMenuList(response.data.data)
            } else {
                // if no item then display the add dish to menu view
                await setEmptyMenuMessage(response.data.message)
            }
            setLoading(false)
        }
        getItems()
    }, [])

    const addDishToUserCart = async (e, dish) => {
        e.preventDefault()

        // check if token is available
        let token = null;
        // if user is logged in or not
        if (await firebase.auth().currentUser && await firebase.auth().currentUser.getIdToken()) {
            token = await firebase.auth().currentUser.getIdToken()
        }

        if (token !== null) {

            // if user is logged in then fetch user details
            const response = await axios.get(`/api/auth/get_user_details/${token}`)
            if (response.data.status === 200) {

                // if user is a user
                if (response.data.data.type === "user") {
                    // then  allow the user to add dish to cart
                    const response = await axios.post('/api/user/order_food', {
                        foodId: dish._id,
                        access_token: token,
                        restaurantId: id
                    })

                    if (response.data.status === 200) {

                        await setItemName(`${dish.name}`)
                        await setVisible(!visible)
                    } else {

                        await setErrorInCartAdditionMessage(`${response.data.message}`)
                        await setErrorVisible(!errorVisible)
                    }
                // if user is a restaurant, then  restrict from adding item to cart. prompt with an alert
                } else if (response.data.data.type === "restaurant") {

                    alert("You are logged in as Restaurant. Kindly login as a user to view cart...")
                }
            } else {
                // if there is some error while fetching data. prompt an alert with the message from backend
                alert(response.data.message)
            }
        } else {
            // if token is invalid, then prompt the user to login first
            alert('You are not logged in! login first...')
        }
    }

    const addDishToCartFormSubmit = async (e) => {

        e.preventDefault()
        const { name, price, type, desc } = e.target.elements
        // if user is logged in then fetch user details
        let token = null;
        if (await firebase.auth().currentUser && await firebase.auth().currentUser.getIdToken()) {
            // if user is a user then  allow the user to add dish to cart
            token = await firebase.auth().currentUser.getIdToken()
            const response = await axios.post('/api/restaurant/addItem', {
                name: name.value,
                desc: desc.value,
                price: price.value,
                type: type.value,
                access_token: token
            })

            alert(`${response.data.message}`)
            openMenuToggle()
        } else {
            // if token is invalid, then prompt the user to login first
            alert('token not valid. please logout once and again login...')
        }
    }

    const checkForRestaurant = async (e) => {
        e.preventDefault()
        // if user is logged in then fetch user details
        let token = null;
        if (await firebase.auth().currentUser && await firebase.auth().currentUser.getIdToken()) {
            // if user is a restaurant then open the add dish menu modal
            token = await firebase.auth().currentUser.getIdToken()
            const response = await axios.get(`/api/auth/get_user_details/${token}`)

            if (response.data.status === 200) {

                if (response.data.data.type === "user") {

                    alert('you have logged in with a user\'s account. Kindly log in as a restaurant to add item to menu list...')
                } else if (response.data.data.type === "restaurant"){

                    openMenuToggle()
                } else {

                    alert('login first')
                }
            } else {
                // if some error in fetching data. alert with the messgage from backend
                alert('Restaurant not found!.')
            }
        }
    }

    if (loading) {
        return (
            <div className="container col-lg-9 align-content-center">
                <div className="list_story_header fixed-top">
                    <h1 className={'homelink logo'}>Loading...</h1>
                </div>
            </div>
        )
    }

    if (emptyMenuMessage) {
        return (
            <div className="container col-lg-9 align-content-center">
                <div className="list_story_header fixed-top">
                    <h4>{emptyMenuMessage}</h4>
                </div>
                <Button
                    onClick={checkForRestaurant}
                    className="add-dish"
                    size="lg"
                    block
                >
                    If you are the restaurant manager. Kindly login with the restaurant's credentials and add your first dish here...
                </Button>
                <AddDishToCartModal
                    openToAddDish={openToAddDish}
                    openMenuToggle={() => openMenuToggle()}
                    addDishToCartFormSubmit={addDishToCartFormSubmit}
                />
            </div>
        )
    }

    return (
        <>
            <div className="container col-lg-9 align-content-center">
                <div className="list_story_header fixed-top">
                    <h1 className={'homelink logo'}>Select item from below menu</h1>
                </div>
                <Alert color="success" isOpen={visible} toggle={onDismiss}>
                    {itemName} added to your cart!
                </Alert>
                <Alert color="success" isOpen={errorVisible} toggle={onErrorDismiss}>
                    {errorInCartAdditionMessage}
                </Alert>
                {
                    menuList.map(menu => (
                        <div
                            key={menu._id}
                            className="row row-cols-1 row-cols-md-1"
                        >
                            <div className="col mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{menu.name}</h4>
                                        <div className="text">{menu.desc ? menu.desc : "description"}</div>
                                    </div>
                                    <div className="card-footer">
                                        {
                                            menu.type && menu.type === "veg" ? (
                                                <img
                                                    src="https://img.icons8.com/fluent/24/000000/vegetarian-food-symbol.png"
                                                    alt="veg"
                                                />
                                            ) : null
                                        }
                                        {
                                            menu.type && menu.type === "non_veg" ? (
                                                <img
                                                    src="https://img.icons8.com/fluent/24/000000/non-vegetarian-food-symbol.png"
                                                     alt="non-veg"
                                                />
                                            ) : null
                                        }
                                        <button
                                            onClick={(e) => addDishToUserCart(e, menu)}
                                            className="footer-button"
                                        >
                                            Move Item to cart
                                        </button>
                                        <AddDishToCartModal
                                            addDishToCartModal={addDishToCartModal}
                                            addDishToCartToggle={() => addDishToCartToggle()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        outlet: state.restaurant,
        cart: state.cart
    }
}

export default connect(mapStateToProps)(RestaurantMenu)