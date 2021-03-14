import React, {useEffect, useState} from 'react'
import axios from 'axios'
import * as firebase from "firebase";
import {Redirect} from "react-router";
import Select from 'react-select'

const options = [
    {value: "all", label: "all"},
    {value: "upcoming launches", label: "upcoming launches"},
    {value: "past launches", label: "past launches"},
]

function Dashboard() {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [launchList , setLaunchList] = useState(null) //
    const [emptyMenuMessage, setEmptyMenuMessage] = useState(null)
    const [launchType, setLaunchType] = useState("all")
    const [displayData, setDisplayData] = useState([])


    // implements when component mounts
    useEffect(() => {
        async function getItems() {
            const currentUser = await firebase.auth().currentUser
            console.log(currentUser)
            if (currentUser !== null) {
                await setCurrentUser(currentUser)
                // fetch all items for a dashboard
                const response = await axios.get(`https://api.spacexdata.com/v3/launches`)
                console.log(response)
                if (response.status === 200) {
                    await setLaunchList(response.data)
                    await setDisplayData(response.data)
                } else {
                    // if no data present then display the add dish to menu view
                    await setEmptyMenuMessage("Bad Request!")
                }
            }
            setLoading(false)
        }
        getItems()
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

    if (currentUser === null) {
        return <Redirect to="/signup" />
    }

    if (emptyMenuMessage) {
        return (
            <div className="container col-lg-9 align-content-center">
                <div className="list_story_header fixed-top">
                    <h4>{emptyMenuMessage}</h4>
                </div>
            </div>
        )
    }

    const handleLaunchTypeChange = async (params) => {
        await setLaunchType(params)
        await setDisplayData([])

        if (params.value === "upcoming launches") {
            await setDisplayData(launchList.filter(data => {
                return data['upcoming'] === true
            }))
        } else if (params.value === "past launches") {
            console.log("hreh")
            await setDisplayData(launchList.filter(data => {
                return data['upcoming'] !== true
            }))
        } else {
            await setDisplayData(launchList)
        }

    }

    return (
        <>
            <div className="container col-lg-9 align-content-center">
                <div className="list_story_header fixed-top">
                    <h1 className={'homelink logo'}>All spaceX launches till date...</h1>
                </div>
                {/*filters*/}
                <div className="filters">

                    <div className="form-group row">
                        <Select
                            className="col-md-3 col-sm-12 form-select"
                            aria-label="Default select example"
                            placeholder="Launch type.."
                            value={launchType}
                            options={options}
                            onChange={(selected) => {handleLaunchTypeChange(selected)}}
                        />

                        <div className="date col-md-3 col-sm-12">
                            <label htmlFor="start-date" className="col-12 col-form-label">Start Date</label>
                            <div className="col-10">
                                <input placeholder="start-date" className="form-control" type="date" id="start-date" />
                            </div>
                        </div>

                        <div className="date col-md-3 col-sm-12">
                            <label htmlFor="End-date" className="col-12 col-form-label">End Date</label>
                            <div className="col-10">
                                <input placeholder="end-date" className="form-control" type="date" id="End-date" />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    displayData.map(vehicle => (
                        <div
                            key={vehicle['flight_number']}
                            className="row row-cols-1 row-cols-md-1"
                        >
                            <div className="col mb-4">
                                <div className="card">
                                    <div className="row card-body">
                                        <div className="col-md-8 col-sm-6 left">
                                            <h4 className="card-title">{vehicle['mission_name']}</h4>
                                            <div className="text">{vehicle.details}</div>
                                            <div className="text">upcoming: {`${vehicle['upcoming']}`}</div>
                                        </div>
                                        <div className="col-md-4 col-sm-6 right">
                                            <div className="date">{vehicle['launch_date_utc'].substring(0, 10)}</div>
                                            <div className="date">
                                                <img className="image" src={vehicle['links']['mission_patch']} alt="mission_patch"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer" />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
export default Dashboard