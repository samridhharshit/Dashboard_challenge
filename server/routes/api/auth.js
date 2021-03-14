const express = require('express')
const router = express.Router()

const login = require("../../controller/auth/login")
const register = require("../../controller/auth/register");
const getUserDetails = require("../../controller/auth/getUserDetails");
const logout = require('../../controller/auth/logout')

// register user/dashboard
router.post('/register', async (req, res) => { res.send(await register(req.body)) })

// logging in a user/dashboard - put request
router.put('/login', async (req, res) => { res.send(await login(req.body)) })

// get user details using access_token
router.get('/get_user_details/:access_token', async (req, res) => { res.send(await getUserDetails(req.params.access_token)) })

// logout the user by setting the access token to ""
router.put('/logout', async (req, res) => { res.send(await logout(req.body.type, req.body.access_token)) })

module.exports = router