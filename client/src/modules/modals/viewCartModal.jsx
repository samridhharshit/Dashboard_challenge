import React, {useEffect, useState} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
export default function ViewCartModal(props) {



    return (
        <div>
            <Modal
                isOpen={props.openToShowCart}
                modalTransition={{ timeout: 100 }}
                backdropTransition={{ timeout: 50 }}
                toggle={props.openCartToggle}
            >
                <ModalHeader toggle={props.openCartToggle}>Your Cart Items are here!</ModalHeader>
                <ModalBody>
                    {
                        props.cart.length !== 0 ? (
                            <div>{props.cart.map(item =>
                                <div
                                    className="cart_view"
                                    key={item._id}
                                >
                                    <div>{item.name}</div>
                                    <div>-></div>
                                    <div>{item.price}</div>
                                </div>
                            )}</div>
                        ) : (
                            <div>{props.cart[0]}</div>
                        )
                    }
                </ModalBody>
            </Modal>
        </div>
    )
}