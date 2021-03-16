import React, {useCallback, useContext, useEffect, useState} from "react";
import { Redirect, Link } from "react-router-dom";
import app from '../auth/base'
import * as firebase from "firebase";
import {AuthContext} from "../auth";

const SignUp = () => {
    const { currentUser } = useContext(AuthContext)

    const [loading, setLoading] = useState(false)
    const [cU, setCurrentUser] = useState(null)

    useEffect(() => {
        async function setUser() {
            await setCurrentUser(currentUser)
        }
        setUser()
    }, [currentUser])

    const handleSignUp = useCallback(async event => {
        event.preventDefault();
        setLoading(true)
        const { email, p1, p2 } = event.target.elements;

        if (p1.value === p2.value) {
            try {
                await app
                    .auth()
                    .createUserWithEmailAndPassword(email.value, p1.value);

                const currentUser = await firebase.auth().currentUser
                if (!currentUser) {
                    alert('signup unsuccessful! Contact the developer...')
                }
                // window.location.reload()
            } catch (error) {
                alert(error);
            }
        } else {
            alert("password did not match!")
        }
        setLoading(false)
    }, []);

    if (cU) {
        return <Redirect to={'/dashboard'} />
    }

    return (
        <>
            <div className="row">
                <div className="col-sm-12 signup-login-container">
                    <div className="col-sm-10 col-md-8 col-lg-6 align-content-center registration">
                        <h1>Signup here...</h1>
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

export default SignUp
