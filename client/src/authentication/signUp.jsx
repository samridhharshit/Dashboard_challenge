import React, {useCallback, useEffect, useState} from "react";
import { Redirect, withRouter, Link } from "react-router-dom";
import app from '../auth/base'
import * as firebase from "firebase";
import axios from 'axios'

import { connect } from 'react-redux'

const SignUp = (props) => {

    const [loading, setLoading] = useState(false)
    const [redirectToMainPage, setRedirectToMainPage] = useState(false)

    const handleSignUp = useCallback(async event => {
        event.preventDefault();
        setLoading(true)
        const { fullName, email, p1, p2, type, desc, veg, non_veg } = event.target.elements;

        const foodTypeArray = []
        if (veg.value === "yes") {
            foodTypeArray.push("veg")
        }
        if (non_veg.value === "yes") {
            foodTypeArray.push("non-veg")
        }

        // console.log(fullName.value, email.value, p1.value, p2.value, type.value, desc.value, veg.value, non_veg.value)
        if (p1.value === p2.value) {
            try {
                await app
                    .auth()
                    .createUserWithEmailAndPassword(email.value, p1.value);

                const currentUser = await firebase.auth().currentUser
                if (!currentUser) {
                    alert('signup unsuccessful! Contact the developer...')
                    window.location.reload()
                } else if (type.value === 'restaurant') {

                    const signupObjectForRestaurant = {
                        name: fullName.value,
                        email: email.value,
                        access_token: await currentUser.getIdToken(),
                        type: "restaurant",
                        food_type: foodTypeArray,
                        desc: desc.value
                    }

                    const response = await axios.post('/api/auth/register', signupObjectForRestaurant)
                    if (response.data.status === 200) {
                        // if (response.data.data.type === "user") {
                        //     props.mountUser(response.data.data)
                        // } else {
                        //     props.mountRestaurant(response.data.data)
                        // }
                        setRedirectToMainPage(true)
                    } else {
                        await firebase.auth().signOut()
                        alert(response.data.message)
                    }
                } else if (type.value === 'user') {
                    const signupObjectForUser= {
                        name: fullName.value,
                        email: email.value,
                        access_token: await currentUser.getIdToken(),
                        type: "user",
                        food_type: foodTypeArray
                    }

                    const response = await axios.post('/api/auth/register', signupObjectForUser)
                    if (response.data.status === 200) {
                        // props.mountUserToStore(response.data.data)
                        setRedirectToMainPage(true)
                    } else {
                        await firebase.auth().signOut()
                        alert('signup failed! try again..')
                    }
                }
                window.location.reload()
            } catch (error) {
                alert(error);
            }
        } else {
            alert("password did not match!")
        }
        setLoading(false)
    }, [props.currentlyLoggedIn]);

    if (firebase.auth().currentUser !== null) {
        return <Redirect to={'/'} />
    }

    return (
        <>
            <div className="row">
                <div className="col-sm-12 signup-login-container">
                    <div className="col-sm-10 col-md-8 col-lg-6 align-content-center registration">
                        <h1>Signup as a User or Restaurant...</h1>
                        <form onSubmit={handleSignUp}>
                            <div className="form-group input-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    id="fullName"
                                    required={true}
                                />
                            </div>
                            <div className="form-group input-group">
                                <label htmlFor="email">Email address</label>
                                <input
                                    name="email"
                                    type="email"
                                    id="email"
                                    aria-describedby="emailHelp"
                                    required={true}
                                />
                            </div>
                            <div className="form-group input-group">
                                <label htmlFor="p1">Password</label>
                                <input
                                    name="p1"
                                    type="password"
                                    id="p1"
                                    required={true}
                                />
                            </div>
                            <div className="form-group input-group">
                                <label htmlFor="p2">Confirm Password</label>
                                <input
                                    name="p2"
                                    type="password"
                                    id="p2"
                                    required={true}
                                />
                            </div>
                            <div className="form-group input-group">
                                <label htmlFor="type">Type</label>
                                <select
                                    className="select"
                                    name="type"
                                    id="type"
                                    defaultValue="restaurant"
                                    required={true}
                                >
                                    <option value="restaurant">Restaurant</option>
                                    <option value="user">Customer</option>
                                </select>
                            </div>
                            <div className="form-group input-group">
                                <label htmlFor="desc">If opted Restaurant. Let us know more about it.</label>
                                <input
                                    style={{"width": "100%"}}
                                    type="text"
                                    id="desc"
                                    name="desc"
                                />
                            </div>
                            <div className="form-group input-group">
                                <label htmlFor="veg">Do you prefer veg?</label>
                                <select
                                    className="select"
                                    name="veg"
                                    id="veg"
                                    defaultValue="yes"
                                    required={true}
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <div className="form-group input-group">
                                <label htmlFor="non-veg">Do you prefer Non-veg?</label>
                                <select
                                    className="select"
                                    name="non_veg"
                                    id="non-veg"
                                    defaultValue="yes"
                                    required={true}
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            {
                                loading ? (
                                    <button type="submit" className="btn btn-primary">Signing you up...</button>
                                ) : (
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                )
                            }
                        </form>
                        <br />
                        <p>Already registered with us?<Link to={'/login'}>Login here...</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        mountUser: (user) => { dispatch({ type: "MOUNT_USER", user }) },
        mountRestaurant: (restaurant) => { dispatch({ type: "MOUNT_RESTAURANT", restaurant }) }
    }
}

export default withRouter(
    connect(null, mapDispatchToProps)
    (SignUp)
);
