import React, {useEffect, useState} from 'react'
import {
    Collapse,
    Button,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav
} from 'reactstrap';
import {Link} from 'react-router-dom'
import * as firebase from "firebase";

function Navigation() {

    const [isOpen, setIsOpen] = useState(false);
    const [cU, setCurrentUser]  = useState(null)

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        async function checkForUserAuthenticity() {
            setCurrentUser(await firebase.auth().currentUser)
        }
        checkForUserAuthenticity()
    }, [cU])

    const handleLogout = async (e) => {
        e.preventDefault()
        await firebase.auth().signOut()
        window.location.reload()
        await setCurrentUser(null)
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
                    Spacex Launches
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

                        ) :(
                            <Button
                                onClick={handleLogout}
                                outline
                                color="danger"
                            >
                                Logout
                            </Button>
                        )
                    }
                </Collapse>
            </Navbar>
        </div>
    )
}


export default Navigation