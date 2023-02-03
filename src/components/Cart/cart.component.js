import React from "react";
import './cart.style.css';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../features/user/userSlice";
import { useEffect } from "react";
import { getCartItems, selectCart, changeQuantity, removeItem, setTitle, setUserInfo, initUserInfo } from "../../features/cart/cartSlice";
import { Loader } from "../Loader/loader.component";
import { CartPopUp } from "../popUps/cartPopUp.component";
import { Link } from "react-router-dom";
import { confirmOrder } from "../../features/cart/cartSlice";
import { OrderPopUp } from "../popUps/orderPopUp.component";

export const Cart = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const cart = useSelector(selectCart);
    const popUp = cart.popUp;
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(getCartItems({
            uid: user.user.uid,
            cart: user.user.cart,
        }));
        dispatch(initUserInfo({
            fullName: user.user.fullName,
            phone: user.user.phone,
            country: user.user.country,
            city: user.user.city,
            address: user.user.address,
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="cart-page">
            <div className="cart-page__wrapper">
                <h2 className="cart-page__title">My cart</h2>
                <div className="cart-page__content">
                    <div className="cart-page__items-wrapper">
                        {cart.cartItems.length ? 
                            cart.cartItems.map((item) => {
                                return(
                                    <div key={item.id} className="cart-page__item">
                                        <div className="cart-page__img-wrapper">
                                            <Link to={`/products/${item.id}`}>
                                                <img src={item.thumbnail} alt='item-logo' className="cart-page__img"></img>
                                            </Link>
                                        </div>
                                        <div className="cart-page__item-controls-wrapper">
                                            <p className="cart-page__item-title">{item.title}</p>
                                            <div className="cart-page__item-controls">
                                                <svg onClick={async () => {
                                                    await dispatch(removeItem({uid: user.user.uid, itemId: item.id}));
                                                    dispatch(setTitle(item.title))
                                                }} className="cart-page__bin-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24.9488 3.86486H18.9569V2.88108C18.9218 1.3 17.6604 0.0351351 16.0836 0H9.91644C8.33962 0.0351351 7.07817 1.3 7.04313 2.88108V3.86486H1.05121C0.455526 3.86486 0 4.32162 0 4.91892C0 5.51622 0.455526 5.97297 1.05121 5.97297H2.90836L4.02965 23.2946C4.09973 24.8054 5.32615 26 6.83288 26H19.1671C20.6739 26 21.9003 24.8054 21.9704 23.2946L23.0916 5.97297H24.9488C25.5445 5.97297 26 5.51622 26 4.91892C26 4.32162 25.5445 3.86486 24.9488 3.86486ZM11.248 19.6757C11.248 20.273 10.7925 20.7297 10.1968 20.7297C9.60108 20.7297 9.14555 20.273 9.14555 19.6757V10.1541C9.14555 9.55676 9.60108 9.1 10.1968 9.1C10.7925 9.1 11.248 9.55676 11.248 10.1541V19.6757ZM16.8544 19.6757C16.8544 20.273 16.3989 20.7297 15.8032 20.7297C15.2075 20.7297 14.752 20.273 14.752 19.6757V10.1541C14.752 9.55676 15.2075 9.1 15.8032 9.1C16.3989 9.1 16.8544 9.55676 16.8544 10.1541V19.6757ZM16.8544 3.86486H9.14555V2.88108C9.18059 2.45946 9.49596 2.14324 9.91644 2.10811H16.0836C16.504 2.14324 16.8194 2.45946 16.8544 2.88108V3.86486Z"/>
                                                </svg>
                                                <button onClick={() => dispatch(changeQuantity({itemId: item.id, uid: user.user.uid, action: '-'}))} disabled={item.quantity <= 1 ? true : false} className="cart-page__item-count">-</button>
                                                <p className="cart-page__item-quantity">{item.quantity}</p>
                                                <button onClick={() => dispatch(changeQuantity({itemId: item.id, uid: user.user.uid, action: '+'}))} className="cart-page__item-count">+</button>
                                            </div>
                                        </div>
                                        <div className="cart-page__item-line"></div>
                                        <div className="cart-page__item-price-wrapper">
                                            <p className="cart-page__item-price-title">Price:</p>
                                            <p className="cart-page__item-price-value">{`$${item.price*item.quantity}`}</p>
                                        </div>
                                    </div>
                                )
                            })
                        :
                        <div className="cart-page__no-results">
                            <h3 className="cart-page__no-results-title">There is no items in your cart yet</h3>
                            <button onClick={() => navigate('/')} className="white-btn">Continue shopping</button>
                        </div>
                        }
                    </div>
                    <div className="cart-page__vertical-line"></div>
                    <div className="cart-page__order-info-wrapper">
                        <div className="input-wrapper">
                            <input id='fullName' className="input cart-page__input" type='text' onBlur={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} onChange={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} defaultValue={cart.userInfo.fullName}></input>
                            <label className="input-label">Full Name</label>
                            {!cart.validators.fullName && <p className="err-msg">You should enter a name</p>}
                        </div>
                        <div className="input-wrapper">
                            <input id='phone' className="input cart-page__input" type='tel' onBlur={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} onChange={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} defaultValue={cart.userInfo.phone}></input>
                            <label className="input-label">Phone</label>
                            {!cart.validators.phone && <p className="err-msg">Invalid phone format</p>}
                        </div>
                        <div className="input-wrapper">
                            <input id='country' className="input cart-page__input" type='text' onBlur={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} onChange={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} defaultValue={cart.userInfo.country}></input>
                            <label className="input-label">Country</label>
                            {!cart.validators.country && <p className="err-msg">Please, choose a country</p>}
                        </div>
                        <div className="input-wrapper">
                            <input id='city' className="input cart-page__input" type='text' onBlur={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} onChange={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} defaultValue={cart.userInfo.city}></input>
                            <label className="input-label">City</label>
                            {!cart.validators.city && <p className="err-msg">Please, enter a city</p>}
                        </div>
                        <div className="input-wrapper">
                            <input id='address' className="input cart-page__input" onBlur={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} onChange={(e) => dispatch(setUserInfo({element: e.target.id, value: e.target.value}))} defaultValue={cart.userInfo.address} type='text'></input>
                            <label className="input-label">Address</label>
                            {!cart.validators.address && <p className="err-msg">Please, enter an address</p>}
                        </div>
                        <div className="cart-page__total-wrapper">
                            <div className="cart-page__total-titles">
                                <p className="cart-page__total-title">Items</p>
                                <p className="cart-page__total-title">Total</p>
                            </div>
                            <div className="cart-page__total-values">
                                <p className="cart-page__total-value">{cart.totalItems}</p>
                                <p className="cart-page__total-value">{`$${cart.totalPrice}`}</p>
                            </div>
                        </div>
                        <button disabled={cart.cartItems.length && cart.validators.allValid ? false : true} onClick={async () => {
                            await dispatch(confirmOrder({
                                uid: user.user.uid,
                                order: {
                                    date: new Date().toLocaleDateString(),
                                    items: cart.cart,
                                    totalPrice: cart.totalPrice,
                                    totalItems: cart.totalItems,
                                    userInfo: cart.userInfo,
                                }
                            }));                            
                        }} className="orange-btn">Confirm the purchase</button>
                        <button onClick={() => navigate('/')} className="white-btn">Continue shopping</button>
                    </div>
                </div>
            </div>
            {cart.loading ? <Loader/> : <></>}
            {popUp.showPopUp && <CartPopUp/>}
            {cart.showOrderPopUp && <OrderPopUp/>}
        </div>
    )
}