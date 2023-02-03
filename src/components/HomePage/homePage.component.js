import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, setCategory, fetchCategories } from "../../features/categories/categoriesSlice";
import { selectItems, fetchItems, loadMoreItems } from "../../features/homePageItems/ItemsSlice";
import { Item } from "../Item/item.component";
import { Loader } from "../Loader/loader.component";
import { Filters } from "../Filters/filters.component";
import './homePage.style.css';
import { CartPopUp } from "../popUps/cartPopUp.component";
import { selectCart } from "../../features/cart/cartSlice";
import { updateLikedItems } from "../../features/favourites/favouritesSlice";

export const HomePage = () =>{
    const category = useSelector(selectCategory).category;
    const dispatch = useDispatch();
    const itemsArr = useSelector(selectItems).itemsArr;
    const itemsLoader = useSelector(selectItems).loading;
    const categoriesLoader = useSelector(selectCategory).loading;
    const loader = itemsLoader || categoriesLoader;
    const page = useSelector(selectItems).page;
    const popUp = useSelector(selectCart).popUp;
    const onScroll = () => {
        const scrollTop = document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight
        if (scrollTop + clientHeight >= scrollHeight) {
            dispatch(loadMoreItems());
            }
        }
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll)
    }, [itemsArr])
    useEffect(() => {
        dispatch(fetchItems({
            page: page,
            cat: category.toLowerCase(),
            search: '',
        }));
        dispatch(updateLikedItems());
        dispatch(fetchCategories());
    }, [page, category])
    return(
        <div className="homepage">
            <Filters filtersAvailable={true}></Filters>
            <div className="homepage__items-wrapper">
                {itemsArr.map((item) => {
                        return(
                            <Item key={item.id} id={item.id} imgUrl={item.thumbnail} title={item.title} price={item.price} liked={item.liked}/>
                        )
                    })}
            </div>
            {loader ? <Loader/> : <></>}
            {popUp.showPopUp && <CartPopUp/>}
        </div>
    )
}