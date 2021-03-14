import React, {useEffect} from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";

export default function ViewSalesModal(props) {
    return (
        <div>
            <Modal
                isOpen={props.openSalesModal}
                modalTransition={{ timeout: 100 }}
                backdropTransition={{ timeout: 50 }}
                toggle={props.openSalesToggle}
            >
                <ModalHeader toggle={props.openSalesToggle}>Your Cart Items are here!</ModalHeader>
                <ModalBody>
                    {
                        props.sales.length !== 0 ? (
                            <div>{props.sales.map(sale =>
                                <div
                                    className="cart_view"
                                    key={sale.items_ordered._id}
                                >
                                    <div>{sale.name}</div>
                                    <div>{sale.items_ordered.name}</div>
                                    <div>&#x20B9;{sale.items_ordered.price}</div>
                                </div>
                            )}</div>
                        ) : props.noDataMessage !== "" ? (
                            <div>{props.noDataMessage}</div>
                        ) : (
                            <div>Please bare with us. This will take some time...</div>
                        )
                    }
                </ModalBody>
            </Modal>
        </div>
    )
}