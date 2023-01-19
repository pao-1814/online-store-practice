import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, setCategory, fetchCategories } from "../../features/categories/categoriesSlice";
import { selectSorting, setSorting } from "../../features/sorting/sortingSlice";
import { selectItems, fetchItems, loadMoreItems, updateLikedItems } from "../../features/homePageItems/ItemsSlice";
import { Item } from "../Item/item.component";
import { Loader } from "../Loader/loader.component";
import { Filters } from "../Filters/filters.component";
import './homePage.style.css';

export const HomePage = () =>{
    const category = useSelector(selectCategory).category;
    const sorting = useSelector(selectSorting).sorting;
    const dispatch = useDispatch();
    const itemsArr = useSelector(selectItems).itemsArr;
    const itemsLoader = useSelector(selectItems).loading;
    const categoriesLoader = useSelector(selectCategory).loading;
    const loader = itemsLoader || categoriesLoader;
    const page = useSelector(selectItems).page;
    useEffect(() => {
        dispatch(fetchItems({
            page: page,
            cat: category.toLowerCase(),
            sort: sorting.toLowerCase(),
        }));
        dispatch(updateLikedItems());
        dispatch(fetchCategories());
    }, [page, category, sorting])
    return(
        <div className="homepage">
            <Filters filtersAvailable={true}></Filters>
            <div className="homepage__items-wrapper">
                {itemsArr.map((item) => {
                    return(
                        <Item key={item.id} id={item.id} imgUrl={item.image} title={item.title} price={item.price} liked={item.liked}/>
                    )
                })}
            </div>
            <button onClick={() => dispatch(loadMoreItems())} className="homepage__load-more-btn">Load more...</button>
            {loader ? <Loader/> : <></>}
        </div>
    )
}