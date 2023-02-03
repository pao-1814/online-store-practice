import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import './orders.style.css';
import { selectOrders, getAllOrders } from "../../features/orders/ordersSlice";
import { selectUser } from "../../features/user/userSlice";
import { Loader } from "../Loader/loader.component";
import { Link } from "react-router-dom";


export const Orders = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser).user;
    const orders = useSelector(selectOrders);
    useEffect(() => {
        dispatch(getAllOrders(user.uid));
    }, [])
    return(
        <>
            <div className="orders_wrapper">
                {Object.keys(orders.ordersObj).length ? 
                Object.keys(orders.ordersObj).map(orderId => {
                    return(
                        <Link key={orderId} to={`/order/${orderId}`}>
                            <div className="orders__item">
                                <div className="orders__item-wrapper">
                                    <div className="orders__titles-wrapper">
                                        <p className="orders__title">Order ID:</p>
                                        <p className="orders__title">Date:</p>
                                    </div>
                                    <div>
                                        <p className="orders__value">{orderId}</p>
                                        <p className="orders__value">{orders.ordersObj[orderId].date}</p>
                                    </div>
                                </div>
                                <div className="orders__item-wrapper">
                                    <div className="orders__titles-wrapper">
                                        <p className="orders__title">Price:</p>
                                    </div>
                                    <div>
                                        <p className="orders__value">{'$' + orders.ordersObj[orderId].totalPrice}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })
                :
                <div className="orders__no-orders">
                    <h2 className="orders__no-orders">There is no completed orders yet</h2>
                </div>
                }
                
            </div>
            {orders.loading && <Loader/>}
        </>
    )
}