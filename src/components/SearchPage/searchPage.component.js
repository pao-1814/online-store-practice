import React from "react";
import { useParams } from "react-router-dom";
import { Item } from "../Item/item.component";
import { Filters } from "../Filters/filters.component";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import './searchPage.style.css';
import { fetchItems, selectItems } from "../../features/homePageItems/ItemsSlice";
import { Loader } from "../Loader/loader.component";
import { CartPopUp } from "../popUps/cartPopUp.component";
import { selectCart } from "../../features/cart/cartSlice";
import { updateLikedItems } from "../../features/favourites/favouritesSlice";

export const SearchPage = () =>{
    let params = useParams();
    const itemsArr = useSelector(selectItems).itemsArr;
    const loader = useSelector(selectItems).loading;
    const popUp = useSelector(selectCart).popUp;
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchItems({
            page: 1,
            category: '',
            search: params.searchStr,
        }));
        dispatch(updateLikedItems());
    }, [params.searchStr]);
    return(
        <div className="search-page">
            <Filters filtersAvailable={false}></Filters>
            {itemsArr.length 
            ?
            <div className="search-page__items-wrapper">
                {itemsArr.map((item) => {
                    return(
                        <Item key={item.id} id={item.id} imgUrl={item.thumbnail} title={item.title} price={item.price} liked={item.liked}/>
                    )
                })}
            </div>
            :
            <div className="search-page__no-results">
                <h3 className="search-page__no-results-title">No results found</h3>
                <p className="search-page__no-results-text">We did not find any article that matches this search
                <br/>
                Make sure that the search text is entered correctly
                <br/>
                Try using other search criteria
                </p>
            </div>
             }
            {loader ? <Loader/> : <></>}
            {popUp.showPopUp && <CartPopUp/>}
        </div>
    )
}