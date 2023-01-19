import React from "react";
import { useParams } from "react-router-dom";
import { Item } from "../Item/item.component";
import { Filters } from "../Filters/filters.component";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import './searchPage.style.css';
import { fetchSearchItems, searchItems, selectItems, updateLikedItems } from "../../features/homePageItems/ItemsSlice";
import { Loader } from "../Loader/loader.component";

export const SearchPage = () =>{
    let params = useParams();
    const itemsArr = useSelector(selectItems).itemsArr;
    const loader = useSelector(selectItems).loading;
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchSearchItems(params.searchStr));
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
                        <Item key={item.id} id={item.id} imgUrl={item.image} title={item.title} price={item.price} liked={item.liked}/>
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
        </div>
    )
}