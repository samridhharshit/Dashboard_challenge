import React, {useEffect, useState} from 'react'
import {
    Collapse,
    Button,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    Badge
} from 'reactstrap';
import {Link, useLocation} from 'react-router-dom'
import * as firebase from "firebase";
import axios from 'axios'
import { connect } from 'react-redux'
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ViewCartModal from "../modals/viewCartModal";
import AddDishToCartModal from "../modals/addDishToCart";
import ViewSalesModal from "../modals/viewSalesModal";

function Navigation(props) {
    let location  = useLocation()

    const [isOpen, setIsOpen] = useState(false);
    const [cU, setCurrentUser]  = useState(null)
    const [openToShowCart, setOpenToShowCart] = useState(false)
    const [openToAddDish, setOpenToAddDish] = useState(false)
    const [openSalesModal, setOpenSalesModal] = useState(false)
    const [cart, setCart] = useState([])
    const [sales, setSales] = useState([])
    const [noDateMessageForSales, setNoDateMessageForSales] = useState("")
    const [currentUserType, setCurrentUserType] = useState("restaurant")

    const toggle = () => setIsOpen(!isOpen);
    const openSalesToggle = () => setOpenSalesModal(!openSalesModal)
    const openCartToggle = () => setOpenToShowCart(!openToShowCart)
    const openMenuToggle = () => setOpenToAddDish(!openToAddDish)

    useEffect(() => {
        console.log(props.user, props.restaurant)
        async function checkForUserAuthenticity() {
            const currentUser = await firebase.auth().currentUser
            console.log(currentUser)
            if (currentUser) {
                const fetchUserData = await axios.get(`/api/auth/get_user_details/${await currentUser.getIdToken()}`)
                console.log(fetchUserData)

                if (fetchUserData.data.status === 200) {
                    setCurrentUser(fetchUserData.data.data)
                    if (fetchUserData.data.data.type === "user") {
                        setCurrentUserType("user")
                        await props.mountUserToStore(fetchUserData.data.data)
                    } else {
                        await props.mountRestaurantToStore(fetchUserData.data.data)
                    }
                } else {
                    await firebase.auth().signOut()
                    setCurrentUser(null)
                }
            }
        }
        checkForUserAuthenticity()
    }, [])

    const handleLogout = async (e) => {
        e.preventDefault()

        let token;
        if (props.currentlyLoggedIn === "user") {
            token = props.user.access_token
        } else {
            token = props.restaurant.access_token
        }

        const status = await axios.put('/api/auth/logout', {
            type: props.currentlyLoggedIn,
            access_token: token
        })
        console.log(status)

        if (props.currentlyLoggedIn === "user") {
            await props.unmountUser()
        } else {
            await props.unmountRestaurant()
        }
        await firebase.auth().signOut()
        await setCurrentUser(null)
    }

    const show_cart = async (e) => {
        e.preventDefault()
        let token = null;
        if (await firebase.auth().currentUser && await firebase.auth().currentUser.getIdToken()) {
            token = await firebase.auth().currentUser.getIdToken()
        }
        if (token !== null) {
            const response = await axios.get(`/api/auth/get_user_details/${token}`)
            if (response.data.status === 200) {

                if (response.data.data.type === "user") {

                    const response = await axios.post('/api/user/viewOrders', {
                        access_token: token,
                        restaurant_id: location.pathname.split('/')[2]
                    })
                    console.log(response)

                    if (response.data.status !== 200) {
                        alert(response.data.message)
                    } else {
                        await setCart(response.data.data)
                        openCartToggle()
                    }
                } else if (response.data.data.type === "restaurant") {
                    alert("You are logged in as Restaurant. Kindly login as a user to view cart...")
                }
            } else {
                alert(response.data.message)
            }
        } else {
            alert('You are not logged in! login first...')
        }
    }

    const open_modal_to_view_sales = async (e) => {
        e.preventDefault()

        let token = null;
        if (await firebase.auth().currentUser && await firebase.auth().currentUser.getIdToken()) {
            token = await firebase.auth().currentUser.getIdToken()
        }

        if (token !== null) {

            const response = await axios.get(`/api/auth/get_user_details/${token}`)
            if (response.data.status === 200) {
                if (response.data.data.type === "restaurant") {
                    openSalesToggle()
                    const res = await axios.get(`/api/restaurant/get_sale_history_details/${token}`)
                    console.log(res)
                    if (res.data.status !== 200) {
                        setNoDateMessageForSales(res.data.message)
                        alert(res.data.message)
                    } else {
                        await setSales(res.data.data)
                    }
                } else if (response.data.data.type === "user") {
                    alert("You are logged in as User. Kindly login as a Restaurant to add item to menu...")
                }
            } else {
                alert(response.data.message)
            }
        } else {
            alert('You are not logged in! login first...')
        }
    }

    const open_modal_to_add_dish = async (e) => {
        e.preventDefault()

        let token = null;
        if (await firebase.auth().currentUser && await firebase.auth().currentUser.getIdToken()) {
            token = await firebase.auth().currentUser.getIdToken()
        }

        if (token !== null) {

            const response = await axios.get(`/api/auth/get_user_details/${token}`)
            if (response.data.status === 200) {
                if (response.data.data.type === "restaurant") {
                    openMenuToggle()
                } else if (response.data.data.type === "user") {
                    alert("You are logged in as User. Kindly login as a Restaurant to add item to menu...")
                }
            } else {
                alert(response.data.message)
            }
        } else {
            alert('You are not logged in! login first...')
        }

    }

    const addDishToCartFormSubmit = async (e) => {
        e.preventDefault()
        const { name, price, type, desc } = e.target.elements
        console.log(name.value, price.value, type.value, desc.value)

        let token = null;
        if (await firebase.auth().currentUser && await firebase.auth().currentUser.getIdToken()) {
            token = await firebase.auth().currentUser.getIdToken()

            const response = await axios.post('/api/restaurant/addItem', {
                name: name.value,
                desc: desc.value,
                price: price.value,
                type: type.value,
                access_token: token
            })
            console.log(response)

            alert(`${response.data.message}`)
            openMenuToggle()
        } else {
            alert('token not valid. please logout once and again login...')
        }

    }

    return (
        <div>
            <Navbar
                sticky={true}
                style={{backgroundColor: '#f1e8ae'}}
                light expand="md"
            >
                <NavbarBrand
                    className="title"
                    href="/"
                >
                    foodShala
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar />
                    {
                        cU === null ? (
                            <Link
                                to='/signup'
                                // className="login-signup"
                            >
                                <Button
                                    outline
                                    color="secondary"
                                >
                                    Signup/Login
                                </Button>
                            </Link>

                        ) : currentUserType === "user" ? (

                            <div  className="logout-cart">
                                <Button
                                    color="warning"
                                    onClick={show_cart}
                                    // className="login-signup"
                                >
                                    <FontAwesomeIcon icon={faCartPlus} size="2x" />
                                </Button>
                                <ViewCartModal
                                    openToShowCart={openToShowCart}
                                    openCartToggle={() => openCartToggle()}
                                    cart={cart}
                                />
                                <Button
                                    onClick={handleLogout}
                                    outline
                                    color="danger"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div  className="logout-cart">
                                <Button
                                    outline
                                    color="primary"
                                    onClick={open_modal_to_view_sales}
                                    className="rest_cookie"
                                >
                                    View Sales
                                </Button>
                                <ViewSalesModal
                                    openSalesModal={openSalesModal}
                                    openSalesToggle={() => openSalesToggle()}
                                    sales={sales}
                                    noDataMessage={noDateMessageForSales}
                                />
                                <Button
                                    outline
                                    color="info"
                                    onClick={open_modal_to_add_dish}
                                    className="rest_cookie"
                                >
                                    Add to menu
                                </Button>
                                <AddDishToCartModal
                                    openToAddDish={openToAddDish}
                                    openMenuToggle={() => openMenuToggle()}
                                    addDishToCartFormSubmit={addDishToCartFormSubmit}
                                />
                                <Button
                                    outline
                                    color="danger"
                                    onClick={handleLogout}
                                    // className="login-signup"
                                >
                                    Logout
                                </Button>
                            </div>
                        )
                    }
                </Collapse>
            </Navbar>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        restaurant: state.restaurant,
        cart: state.cart,
        currentlyLoggedIn: state.currentlyLoggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        mountUserToStore: (user) => { dispatch({ type: "MOUNT_USER", user }) },
        mountRestaurantToStore: (restaurant) => { dispatch({ type: "MOUNT_RESTAURANT", restaurant }) },
        unmountRestaurant: () => { dispatch({ type: "UNMOUNT_RESTAURANT" }) },
        unmountUser: () => { dispatch({ type: "UNMOUNT_USER" }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)