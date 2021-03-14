import React, {useEffect, useState} from "react";
import axios from 'axios'
import { Link } from "react-router-dom";

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [restaurants, setRestaurants] = useState(null)

    useEffect(() => {
        async function getAllRestaurants() {
            const response = await axios.get('/api/restaurant')
            if (response.status === 200) {
                await setRestaurants(response.data)
                setLoading(false)
            }
        }
        getAllRestaurants()
    }, [])

    if (loading) {
        return (
            <div className="container col-lg-9 align-content-center">
                <div className="list_story_header fixed-top">
                    <h1 className={'homelink logo'}>Loading...</h1>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container col-lg-9 align-content-center">
                <div className="list_story_header fixed-top">
                    <h1 className={'homelink logo'}>Select from below Restaurants</h1>
                </div>
                {
                    restaurants.map(restaurant => (
                        <div
                            key={restaurant._id}
                            className="row row-cols-1 row-cols-md-1"
                        >
                            <div className="col mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{restaurant.name}</h4>
                                        <div className="text">{restaurant.desc ? restaurant.desc : "description"}</div>
                                    </div>
                                    <div className="card-footer">
                                        {
                                            restaurant.food_type && restaurant.food_type.includes("veg") ? (
                                                <img src="https://img.icons8.com/fluent/24/000000/vegetarian-food-symbol.png"
                                                     alt="veg"
                                                />
                                            ) : null
                                        }
                                        {
                                            restaurant.food_type && restaurant.food_type.includes("non-veg") ? (
                                                <img src="https://img.icons8.com/fluent/24/000000/non-vegetarian-food-symbol.png"
                                                     alt="non-veg"
                                                />
                                            ) : null
                                        }
                                        <Link
                                            to={`/restaurant/${restaurant._id}`}
                                            className="restaurant-collection-footer-button"
                                        >
                                            Explore your menu here...
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );


};

export default Home;