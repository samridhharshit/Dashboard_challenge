const express = require('express');
const router = express.Router();

const orderFood = require('../../controller/user/orderFood')
const viewOrders = require('../../controller/user/viewOrders')

// create new order for a user
router.post('/order_food', async (req, res) => { res.send(await orderFood(req.body)) })

// fetch orders for a user
router.post('/viewOrders', async (req, res) => { res.send(await viewOrders(req.body.access_token, req.body.restaurant_id)) })

module.exports = router