import React, {useEffect} from "react";
import { Item } from "../Item/item.component";
import { useDispatch, useSelector } from "react-redux";
import { selectFavourites, getLikedItems } from "../../features/favourites/favouritesSlice";
import './favourites.style.css';
import { Loader } from "../Loader/loader.component";
import { useNavigate } from "react-router-dom";

export const Favourites = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const state = useSelector(selectFavourites);
    useEffect(() => {
        dispatch(getLikedItems(state.likedItems));
    }, [state.likedItems]);
    return(
        <>
            <div className="favourites">
                {state.likedItems.length ? 
                <div className="favourites__items-wrapper">
                    {state.itemsArr.map((item) => {
                        return (
                            <Item key={item.id} id={item.id} imgUrl={item.thumbnail} title={item.title} price={item.price} liked={item.liked}/>
                        )
                    })}
                </div>
                :
                <div className="favourites__no-results">
                    <h2 className="favourites__no-results-title">There is no products in your favourites</h2>
                    <p className="favourites__no-results-text">Click on the like icon to add a product to favourite</p>
                    <button onClick={() => navigate('/')} className="cart-page__continue-btn">Continue shopping</button>
                </div>
                }
            </div>
            {state.loading && <Loader/>}
        </>
    )
}