import React from "react";
import { Filters } from "../Filters/filters.component";
import './itemPage.style.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { selectItemPage, fetchItem, increaseCount, decreaseCount, clearItemPageState } from "../../features/itemPage/itemPageSlice";
import { Loader } from "../Loader/loader.component";
import { selectUser } from "../../features/user/userSlice";
import { toggleLoginModal } from "../../features/loginModal/loginModalSlice";
import { addToCart, setTitle } from "../../features/cart/cartSlice";
import { likeItem, selectFavourites } from "../../features/favourites/favouritesSlice";


export const ItemPage = () => {
    let params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const item = useSelector(selectItemPage).item;
    const loader = useSelector(selectItemPage).loading;
    const likedItems = useSelector(selectFavourites).likedItems
    const liked = likedItems.includes(item.id);
    const user = useSelector(selectUser);
    useEffect(() => {
        dispatch(fetchItem(params.productId))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return(
        <div className="item-page">
            <Filters filtersAvailable={true}></Filters>
            <div onClick={(e) => {
                if(e.target.className === 'item-page__bg'){
                    dispatch(clearItemPageState());
                    navigate(window.history.length > 2 ? -1 : '/');
                }
            }} className="item-page__bg">
                <div className="item-page__wrapper">
                    <div onClick={() => {
                        dispatch(clearItemPageState());
                        navigate(window.history.length > 2 ? -1 : '/');
                    }} className="close-btn-wrapper">
                        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className="close-btn" d="M25 2.51786L22.4821 0L12.5 9.98214L2.51786 0L0 2.51786L9.98214 12.5L0 22.4821L2.51786 25L12.5 15.0179L22.4821 25L25 22.4821L15.0179 12.5L25 2.51786Z"/>
                        </svg>
                    </div>
                    <div className="item-page__content-wrapper">
                        <div className="item-page__img-wrapper">
                            <img alt="item-img" src={item.thumbnail} className="item-page__img"></img>
                        </div>
                        <div className="item-page__info-wrapper">
                            <h1 className="item-page__title">{item.title}</h1>
                            <p className="item-page__description">{item.description}</p>
                            <div className="item-page__price-wrapper">
                                <p className="item-page__price-title">PRICE</p>
                                <p className="item-page__price">${item.price}</p>
                            </div>
                            <div className="item-page__count-wrapper">
                                <button disabled={item.quantity === 1 ? true : false} onClick={() => dispatch(decreaseCount())} className="item-page__count">-</button>
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
                        <button onClick={async () => {
                            if(user.loggedIn){
                                await dispatch(addToCart({
                                    itemId: item.id, quantity: item.quantity, uid: user.user.uid
                                }));
                                dispatch(setTitle(item.title))
                                dispatch(clearItemPageState());
                                navigate(window.history.length > 2 ? -1 : '/');
                            }
                            else{
                                dispatch(toggleLoginModal())
                            }
                        }} className="white-btn">ADD TO CART</button>
                        <button onClick={() => dispatch(likeItem(item.id))} className="white-btn">{liked ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}</button>
                        <button onClick={async () => {
                            if(user.loggedIn){
                                await dispatch(addToCart({itemId: item.id, quantity: item.quantity, uid: user.user.uid}));
                                dispatch(setTitle(item.title));
                                navigate('/cart');
                            }
                            else{
                                dispatch(toggleLoginModal())
                            }
                        }} className="orange-btn">BUY NOW</button>
                    </div>
                </div>
            </div>
            {loader ? <Loader/> : <></>}
        </div>
    )
}