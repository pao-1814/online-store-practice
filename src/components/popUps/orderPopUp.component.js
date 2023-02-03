import React from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { hideOrderPopUpAsync, toggleOrderPopUp } from "../../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { showOrders } from "../../features/account/accountSlice";

export const OrderPopUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(hideOrderPopUpAsync());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return(
        <div onClick={(e) => {
            if(e.target.className === 'order-popup'){
                dispatch(toggleOrderPopUp());
            }
        }} className="order-popup">
            <div className="order-popup-wrapper">
                <div className="close-btn-wrapper">
                    <svg onClick={() => dispatch(toggleOrderPopUp())} width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="close-btn" d="M25 2.51786L22.4821 0L12.5 9.98214L2.51786 0L0 2.51786L9.98214 12.5L0 22.4821L2.51786 25L12.5 15.0179L22.4821 25L25 22.4821L15.0179 12.5L25 2.51786Z"/>
                    </svg>
                </div>
                <h2 className="order-popup__title">Thank you for your purchase</h2>
                <p className="order-popup__text">We will send you a notification when your order arrives to you</p>
                <Link to = '/'><button className="order-popup__sign-in-btn">Continue shopping</button></Link>
                <button onClick={()=> {
                    dispatch(showOrders());
                    navigate('/account')
                }} className="order-popup__guest-btn">View order history</button>
            </div>
        </div>
    )
}