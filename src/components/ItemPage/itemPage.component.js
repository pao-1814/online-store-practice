import React from "react";
import { Filters } from "../Filters/filters.component";
import './itemPage.style.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { selectItemPage, fetchItem, increaseCount, decreaseCount, clearItemPageState, likeItem } from "../../features/itemPage/itemPageSlice";
import { Loader } from "../Loader/loader.component";

export const ItemPage = () => {
    let params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const item = useSelector(selectItemPage).item;
    const loader = useSelector(selectItemPage).loading
    useEffect(() => {
        dispatch(fetchItem(params.productId))
    }, []);
    console.log(window.history)
    return(
        <div className="item-page">
            <Filters filtersAvailable={true}></Filters>
            <div className="item-page__bg">
                <div className="item-page__wrapper">
                    <div onClick={() => {
                        dispatch(clearItemPageState());
                        navigate(window.history.length > 2 ? -1 : '/');
                    }} className="item-page__close-btn-wrapper">
                        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className="item-page__close-btn" d="M25 2.51786L22.4821 0L12.5 9.98214L2.51786 0L0 2.51786L9.98214 12.5L0 22.4821L2.51786 25L12.5 15.0179L22.4821 25L25 22.4821L15.0179 12.5L25 2.51786Z"/>
                        </svg>
                    </div>
                    <div className="item-page__content-wrapper">
                        <div className="item-page__img-wrapper">
                            <img src={item.image} className="item-page__img"></img>
                        </div>
                        <div className="item-page__info-wrapper">
                            <h1 className="item-page__title">{item.title}</h1>
                            <p className="item-page__description">{item.description}</p>
                            <div className="item-page__price-wrapper">
                                <p className="item-page__price-title">PRICE</p>
                                <p className="item-page__price">${item.price}</p>
                            </div>
                            <div className="item-page__count-wrapper">
                                <button disabled={item.quantity == 1 ? true : false} onClick={() => dispatch(decreaseCount())} className="item-page__count">-</button>
                                <p className="item-page__count-value">{item.quantity}</p>
                                <button onClick={() => dispatch(increaseCount())} className="item-page__count">+</button>
                            </div>
                            <div className="item-page__total-wrapper">
                                <p className="item-page__total-title">Items:<span className="item-page__total-value">{item.quantity}</span></p>
                                <p className="item-page__total-title">Total:<span className="item-page__total-value">${item.price * item.quantity}</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="item-page__buttons-wrapper">
                        <button className="item-page__cart-btn">ADD TO CART</button>
                        <button onClick={() => dispatch(likeItem())} className="item-page__favorites-btn">{item.liked ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}</button>
                        <button className="item-page__buy-btn">BUY NOW</button>
                    </div>
                </div>
            </div>
            {loader ? <Loader/> : <></>}
        </div>
    )
}