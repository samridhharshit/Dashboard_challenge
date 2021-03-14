import React, {useEffect} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

export default function AddDishToCartModal(props) {
    return (
        <Modal isOpen={props.openToAddDish} toggle={props.openMenuToggle} >
            <ModalHeader toggle={props.openMenuToggle}>Add dish to cart modal</ModalHeader>
            <form onSubmit={props.addDishToCartFormSubmit} className="form">
                <ModalBody>
                    <div className="input-group">
                        <label htmlFor="name">Make the dish name sounds delicious!</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required={true}
                        />
                    </div><br/>
                    <div className="input-group">
                        <label htmlFor="desc">Tell us more about it(max 300 words)</label>
                        <input
                            type="text"
                            id="desc"
                            name="desc"
                            required={true}
                        />
                    </div><br/>
                    <div className="input-group">
                        <label htmlFor="price">How much will it cost us?</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            required={true}
                        />
                    </div><br/>
                    <div className="input-group">
                        <label htmlFor="type">Is it veg or non-veg?</label>
                        <select
                            className="select"
                            name="type"
                            id="type"
                            defaultValue="veg"
                            required={true}
                        >
                            <option value="veg">Veg</option>
                            <option value="non_veg">Non-Veg</option>
                        </select>
                    </div><br/>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" outline={true} onClick={props.openMenuToggle}>Cancel</Button>
                    <Button type="submit" color="success" outline={true} >Add to cart...</Button>{' '}
                </ModalFooter>
            </form>
        </Modal>
    )
}