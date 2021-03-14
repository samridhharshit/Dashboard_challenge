import React, {useEffect} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

export default function AddDishToMenuModal(props) {

    useEffect(() => {
        console.log(props)
    }, [])

    return (
        <div>
            <Modal isOpen={props.addDishToMenuModal} toggle={props.addDishToMenuToggle} >
                <ModalHeader toggle={props.addDishToMenuToggle}>Add dish to menu</ModalHeader>
                <form onSubmit={props.handleDishAdditionToRestaurantMenu} className="form">
                    <ModalBody>
                        <div className="input-group">
                            <label htmlFor="value">Code Value</label>
                            <input
                                type="number"
                                id="value"
                                name="value"
                            />
                        </div><br/>
                        <div className="input-group">
                            <label htmlFor="codeValue">Your Code</label>
                            <input
                                type="text"
                                id="codeValue"
                                name="code_string"
                            />
                        </div><br/>
                        <div className="input-group">
                            <label htmlFor="start-date">Start Date</label>
                            <input type="date" id="start-date" name="start_date"/>
                        </div><br/>
                        <div className="input-group">
                            <label htmlFor="end-date">End Date</label>
                            <input type="date" id="end-date" name="end_date"/>
                        </div><br/>
                        <div className="input-group">
                            <label htmlFor="thresholdAmount">Threshold Amount</label>
                            <input
                                type="number"
                                id="thresholdAmount"
                                name="minAmount"
                            />
                        </div><br/>
                        <div className="input-group">
                            <label htmlFor="type">Type</label>
                            <select className="select" name="type" id="type">
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat</option>
                            </select>
                        </div><br/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" outline={true} onClick={props.addDishToMenuToggle}>Cancel</Button>
                        <Button type="submit" color="success" outline={true} >Add to menu...</Button>{' '}
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    )
}