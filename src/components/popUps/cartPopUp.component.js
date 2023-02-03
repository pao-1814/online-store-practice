import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCart, hidePopUp, hidePopUpAsync } from "../../features/cart/cartSlice";
import './popUps.style.css';


export const CartPopUp = () => {
    const dispatch = useDispatch();
    const popUp = useSelector(selectCart).popUp;
    useEffect(() => {
        dispatch(hidePopUpAsync());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [popUp.title])
    return(
        <div className={"cart-popUp" + (popUp.added ? " added" : " removed")}>
            {popUp.added ?
                <p className="cart-popUp__text">You've successfully added <strong>"{popUp.title}"</strong> to cart</p>
                :
                <p className="cart-popUp__text">You've removed <strong>"{popUp.title}"</strong> from your cart</p>
            }
            <div className="cart-popUp__close-btn-wrapper">
                <svg onClick={() => dispatch(hidePopUp())} width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="cart-popUp__close-btn" d="M25 2.51786L22.4821 0L12.5 9.98214L2.51786 0L0 2.51786L9.98214 12.5L0 22.4821L2.51786 25L12.5 15.0179L22.4821 25L25 22.4821L15.0179 12.5L25 2.51786Z"/>
                </svg>
            </div>
        </div>
    )
}