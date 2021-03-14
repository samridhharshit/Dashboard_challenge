const express = require('express');
const router = express.Router();

const addItemToMenu = require('../../controller/restaurant/addItemToMenu')
const getItems = require('../../controller/restaurant/getItems')
const getPastOrdersDetails = require('../../controller/restaurant/getPastOrdersDetails')
const getAllRestaurants = require("../../controller/restaurant/getAllRestaurants");

// get all restaurants
router.get('/', async (req, res) => { res.send(await getAllRestaurants()) })

// to add a food item to the menu
router.post('/addItem', async (req, res) => { res.send(await addItemToMenu(req.body)) })

// show items from a restaurant
router.get('/get_items/:restaurantId', async (req, res) => { res.send(await getItems(req.params.restaurantId)) })

// view list of customers and whatever that has been ordered by them ie order details
router.get('/get_sale_history_details/:access_token', async (req, res) => { res.send(await getPastOrdersDetails(req.params.access_token)) })


module.exports = router