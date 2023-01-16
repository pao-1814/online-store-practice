import React, { useState } from "react";
import searchIcon from '../../assets/icons/search.svg';
import './homePage.style.css';
import categoryIcon from '../../assets/icons/categoryIcon.svg';
import greyArrow from '../../assets/icons/grey_arrow.svg';
import sortingIcon from '../../assets/icons/icon_sorting.svg';
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, toggleCategories, setCategory } from "../../features/categories/categoriesSlice";
import { selectSorting, toggleSorting, setSorting } from "../../features/sorting/sortingSlice";
import { selectItems } from "../../features/homePageItems/ItemsSlice";
import { Item } from "../Item/item.component";

export const HomePage = () =>{
    const category = useSelector(selectCategory).category;
    const categoryOpen = useSelector(selectCategory).categoryOpen;
    const sorting = useSelector(selectSorting).sorting;
    const sortingOpen = useSelector(selectSorting).sortingOpen;
    const dispatch = useDispatch();
    const itemsArr = useSelector(selectItems).itemsArr;
    return(
        <div className="homepage">
            <div className="homepage__filters-menu-wrapper">
                <input name="search" type="text" className="homepage__search" placeholder='&#61442; Search products by name'/>
                <div className="homepage__category">
                    <button onClick={() => dispatch(toggleCategories())} className="homepage__category-btn">
                        <img src={categoryIcon} alt='category-icon'></img>
                        <p className="category-btn-text">{category}</p>
                        <img src={greyArrow} alt='arrow'></img>
                    </button>
                    {categoryOpen 
                    ?
                    <div className="homepage__categories-list">
                        <button onClick={() => dispatch(setCategory('Choose Category'))} className="homepage__category-item">All items</button>
                        <button onClick={(e) => dispatch(setCategory(e.target.textContent))} className="homepage__category-item">Test item 1</button>
                        <button onClick={(e) => dispatch(setCategory(e.target.textContent))} className="homepage__category-item">Test item 2</button>
                        <button onClick={(e) => dispatch(setCategory(e.target.textContent))} className="homepage__category-item">Test item 3</button>
                        <button onClick={(e) => dispatch(setCategory(e.target.textContent))} className="homepage__category-item">Test item 4</button>
                    </div>
                    :
                    <></>
                    }
                </div>
                <div className="homepage__sorting">
                    <button onClick={() => dispatch(toggleSorting())} className="homepage__sorting-btn">
                        <img src={sortingIcon} alt='sorting-icon'></img>
                        <p className="category-btn-text">{sorting}</p>
                        <img src={greyArrow} alt='arrow'></img>
                    </button>
                    {sortingOpen 
                    ?
                    <div className="homepage__categories-list">
                        <button onClick={() => dispatch(setSorting('Sorting'))} className="homepage__category-item">Default</button>
                        <button onClick={(e) => dispatch(setSorting(e.target.textContent))} className="homepage__category-item">Test item 1</button>
                        <button onClick={(e) => dispatch(setSorting(e.target.textContent))} className="homepage__category-item">Test item 2</button>
                        <button onClick={(e) => dispatch(setSorting(e.target.textContent))} className="homepage__category-item">Test item 3</button>
                        <button onClick={(e) => dispatch(setSorting(e.target.textContent))} className="homepage__category-item">Test item 4</button>
                    </div>
                    :
                    <></>
                    }
                </div>
            </div>
            <div className="homepage__items-wrapper">
                {itemsArr.map((item) => {
                    return(
                        <Item key={item.id} id={item.id} imgUrl={item.image} title={item.title} price={item.price} liked={item.liked}/>
                    )
                })}
            </div>
        </div>
    )
}