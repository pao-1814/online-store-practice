import React from "react";
import './orderPage.style.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder, selectOrders } from "../../features/orders/ordersSlice";
import { selectUser } from "../../features/user/userSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Loader/loader.component";
import { toggleLoginModal } from "../../features/loginModal/loginModalSlice";

export const OrderPage = () => {
    const dispatch = useDispatch();
    const order = useSelector(selectOrders).orderPageObj;
    const loader = useSelector(selectOrders).loading;
    const params = useParams();
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getOrder({
            uid: user.user.uid,
            orderId: params.orderId,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if(!user.loggedIn) {
            navigate('/');
            dispatch(toggleLoginModal());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.userLogined])
    return(
        <div onClick={(e) => {
            if(e.target.className === "order-page"){
                navigate(window.history.length > 2 ? -1 : '/');
            }
        }} className="order-page">
            <div className="order-page__wrapper">
                <div className="close-btn-wrapper">
                    <svg onClick={() => navigate(window.history.length > 2 ? -1 : '/')} width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="close-btn" d="M25 2.51786L22.4821 0L12.5 9.98214L2.51786 0L0 2.51786L9.98214 12.5L0 22.4821L2.51786 25L12.5 15.0179L22.4821 25L25 22.4821L15.0179 12.5L25 2.51786Z"/>
                    </svg>
                </div>
                <h2 className="order-page__title">Order details ID {params.orderId}</h2>
                <div className="order-page__items-wrapper">
                    {order.items ? 
                    order.items.map((item) => {
                        return(
                            <div key={item.id} className="order-page__item">
                                <div className="order-page__img-wrapper">
                                    <img src={item.thumbnail} alt='item-logo' className="order-page__img"></img>
                                </div>
                                <div className="order-page__item-info">
                                    <p className="order-page__item-title">{item.title}</p>
                                    <p className="order-page__property">Items: <span className="order-page__property-value">{item.quantity}</span></p>
                                </div>
                                <div className="order-page__item-line"></div>
                                <div className="order-page__item-price-wrapper">
                                    <p className="order-page__item-price-title">Price:</p>
                                    <p className="order-page__item-price-value">${item.quantity * item.price}</p>
                                </div>
                            </div>
                        )
                    })
                    :
                    <></>}
                </div>
                <div className="order-page__info">
                    <div className="order-page__info-wrapper">
                        <div className="order-page__info-title-wrapper">
                            <p className="order-page__property">Date:</p>
                            <p className="order-page__property">Address:</p>
                        </div>
                        <div className="order-page__info-values-wrapper">
                            <p className="order-page__property-value">{order.date ? order.date : ''}</p>
                            <p className="order-page__property-value">{order.userInfo ? `${order.userInfo.address}, ${order.userInfo.city}, ${order.userInfo.country}` : ''}</p>
                        </div>
                    </div>
                    <div className="order-page__info-wrapper">
                        <div className="order-page__info-title-wrapper">
                            <p className="order-page__property">Items:</p>
                            <p className="order-page__property">Total:</p>
                        </div>
                        <div className="order-page__info-values-wrapper">
                            <p className="order-page__property-value">{order.totalItems ? order.totalItems : ''}</p>
                            <p className="order-page__property-value">${order.totalPrice ? order.totalPrice : ''}</p>
                        </div>
                    </div>
                </div>
            </div>
            {loader && <Loader/>}
        </div>
    )
}