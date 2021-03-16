import React, { useCallback, useContext, useState } from "react";
import {Redirect, Link} from "react-router-dom";
import app from '../auth/base'
import { AuthContext } from "../auth"

const Login = () => {
    const { currentUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false)

    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;

            await setLoading(true)
            try {
                await app
                    .auth()
                    .signInWithEmailAndPassword(email.value, password.value);

                // window.location.reload()
            } catch (error) {
                alert(error);
            }
            setLoading(false)
        },
        []
    );



    if (currentUser) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="row">
            <div className="col-sm-12 signup-login-container">
                <div className="col-sm-10 col-md-8 col-lg-6 align-content-center registration">
                    <h1>Can't wait to see you on the other side!</h1>
                    <form onSubmit={handleLogin}>
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
                            <label htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                id="password"
                                required={true}
                            />
                        </div>
                        {
                            loading ? (
                                <button type="submit" className="btn btn-primary">logging you in...</button>
                            ) : (
                                <button type="submit" className="btn btn-primary">Login</button>
                            )
                        }
                    </form>
                    <br />
                    <p>Don't have an account? No worries, <Link to={'/signup'}>Click here </Link>to register..</p>
                </div>
            </div>
        </div>
    );
};

export default Login